import { db } from "@/db";
import { openai } from "@/lib/openai";

import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { sendMessageValidator } from "@/lib/sendMessageValidator";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Endpoint for asking questions to the AI
export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const userId = user.id;

  if (!user || !userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { fileId, message } = sendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  // Vectorize the message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index("pagepal");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  // Search for pages similar to the message
  const results = await vectorStore.similaritySearch(message, 3);

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 5,
  });

  const formattedMessages = prevMessages.map((m) => ({
    role: m.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: m.text,
  }));

  // Send the results to OpenAI
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    // OpenAI prompt
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
      \n----------------\n
  
      PREVIOUS CONVERSATION:
      ${formattedMessages.map((message) => {
        if (message.role === "user") return `User: ${message.content}\n`;
        return `Assistant: ${message.content}\n`;
      })}
      
      \n----------------\n
      
      CONTEXT:
      ${results.map((r) => r.pageContent).join("\n\n")}
      
      USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          userId,
          fileId,
        },
      });
    },
  });

  // Return response as a stream to the client
  return new StreamingTextResponse(stream);
};
