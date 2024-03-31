"use client";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface BillingFormProps {
  // Return value of the getSubscriptionPlan function
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { toast } = useToast();
  const { isSubscribed, isCanceled, stripeSubscriptionEnd } = subscriptionPlan;

  const { mutate: createSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;

        if (!url) {
          toast({
            title: "There was an error",
            description: "Please try again in a moment.",
            variant: "destructive",
          });
        }
      },
    });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form className="mt-12" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the{" "}
              <span className="text-semibold">{subscriptionPlan.name}</span>
              plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit" className="text-white">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubscribed ? "Manage Subscription" : "Get Premium"}
            </Button>

            {isSubscribed && (
              <p className="rounded-full text-xs font-medium">
                {isCanceled
                  ? "Your plan is cancelled"
                  : "Your plan will be renewed"}
                {format(stripeSubscriptionEnd!, "dd.MMM, yyyy")}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
