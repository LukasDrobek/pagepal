"use client";

// Sync logged in user to db

import { trpc } from "@/app/_trpc/client";

import { useRouter, useSearchParams } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  trpc.authCallback.useQuery(undefined, {});

  const test = trpc.authCallback.useQuery();

  // const { data, error, isLoading } = trpc.authCallback.useQuery();

  // useEffect(() => {
  //   if (!isLoading && data?.success) {
  //     router.push(origin ? `/${origin}` : "/dashboard");
  //   }

  //   if (error instanceof TRPCError && error.code === "UNAUTHORIZED") {
  //     router.push("/sign-in");
  //   }
  // }, [data, error, isLoading, origin, router]);

  // trpc.authCallback.useQuery(undefined, {
  //   onSuccess: ({ success }) => {
  //     if (success) {
  //       // user is synced to db
  //       router.push(origin ? `/${origin}` : '/dashboard')
  //     }
  //   },
  //   onError: (err) => {
  //     if (err.data?.code === 'UNAUTHORIZED') {
  //       router.push('/sign-in')
  //     }
  //   },
  //   retry: true,
  //   retryDelay: 500,
  // })

  // const { data, error, isLoading } = useQuery(
  //   "authCallback",
  //   trpc.authCallback,
  //   {
  //     onSuccess: ({ success }: { success: boolean }) => {
  //       if (success) {
  //         router.push(origin ? `/${origin}` : "/dashboard");
  //       }
  //     },
  //     onError: (err: Error) => {
  //       if (err instanceof TRPCError && err.code === "UNAUTHORIZED") {
  //         router.push("/sign-in");
  //       }
  //     },
  //     retry: true,
  //     retryDelay: 500,
  //   }
  // );

  // const query = useQuery(['authCallback', undefined]);

  // useEffect(() => {
  //   if (query.error) {
  //     const err = query.error;
  //     if (err instanceof TRPCError && err.code === 'UNAUTHORIZED') {
  //       router.push('/sign-in');
  //     }
  //   }

  //   if (query.data?.success) {
  //     router.push(origin ? `/${origin}` : '/dashboard');
  //   }
  // }, [query.error, query.data, router, origin]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animtae-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be automatically redirected in a second.</p>
      </div>
    </div>
  );
};

export default Page;
