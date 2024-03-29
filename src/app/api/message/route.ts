import { db } from "@/db";

import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { sendMessageValidator } from "@/lib/sendMessageValidator";

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
};
