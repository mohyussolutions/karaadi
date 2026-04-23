import { getMyBusinesses } from "@/actions/categories/businessActions";
import { getAllBusinessPlans, type BusinessPlan } from "@/actions/categories/businessPlanActions";
import type { Business } from "@/actions/categories/businessActions";
import BusinessClient from "./BusinessClient";

export default async function BusinessPage() {
  const [bizData, planData] = await Promise.all([
    getMyBusinesses(),
    getAllBusinessPlans(),
  ]);

  const businesses: Business[] = (bizData as any)?.businesses ?? [];
  const plans: BusinessPlan[]  = (planData as any)?.plans ?? [];

  return <BusinessClient businesses={businesses} plans={plans} />;
}
