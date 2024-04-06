import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PLANS } from "@/config/stripe";

const f = createUploadthing();

const middleware = async () => {
  // Make sure user is authenticated
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { userId: user.id, subscriptionPlan };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: { key: string; name: string; url: string };
}) => {
  // Check if the file already exists in the database
  const doesFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (doesFileExist) return;

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://utfs.io/f/${file.key}`,
      uploadStatus: "PROCESSING",
    },
  });

  // Index the PDF file in Pinecone (langchain)
  try {
    const res = await fetch(file.url);
    const blob = await res.blob();
    const loader = new PDFLoader(blob);

    const pageContent = await loader.load();
    const pagesNumber = pageContent.length;

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    // Check if the user is uploading more pages than their plan allows
    const isPremiumExceeded =
      pagesNumber > PLANS.find((plan) => plan.name === "Premium")!.pagesPerPdf;
    const isFreeExceeded =
      pagesNumber > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    if (
      (isSubscribed && isPremiumExceeded) ||
      (!isSubscribed && isFreeExceeded)
    ) {
      await db.file.update({
        where: {
          id: createdFile.id,
        },
        data: {
          uploadStatus: "FAILED",
        },
      });
    }

    // Vectorize the PDF
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index("pagepal");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageContent, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });

    await db.file.update({
      where: {
        id: createdFile.id,
      },
      data: {
        uploadStatus: "SUCCESS",
      },
    });
  } catch (err) {
    await db.file.update({
      where: {
        id: createdFile.id,
      },
      data: {
        uploadStatus: "FAILED",
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),

  premiumPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
