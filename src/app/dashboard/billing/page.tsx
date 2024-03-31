import { getUserSubscriptionPlan } from "@/lib/stripe";
import BillingForm from "@/components/BillingForm";

const Page = async () => {
  // Determine the subscription plan
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subscriptionPlan} />;
};

export default Page;
