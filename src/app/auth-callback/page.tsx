// Sync logged in user to db

import { trpc } from "@/app/_trpc/client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, isLoading } = trpc.authCallback.useQuery();

  useEffect(() => {
    if (!isLoading && data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [data, isLoading, origin, router]);
};

export default Page;
