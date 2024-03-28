import { db } from "@/db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  //  Check if user is logging in for the first time
  if (!user || !user.id) redirect("/auth/callback?origin=/dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    console.log("No DB user found, redirecting...");
    redirect("/auth-callback?origin=dashboard");
  }

  return (
    <div>
      <h1>{user.email}</h1>
    </div>
  );
};

export default Page;
