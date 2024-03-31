"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const UpgradeButton = () => {
  const { mutate: createSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      console.log(url);
      window.location.href = url ?? "/dashboard/billing";
    },
  });

  return (
    <Button className="w-full" onClick={() => createSession()}>
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5"></ArrowRight>
    </Button>
  );
};

export default UpgradeButton;
