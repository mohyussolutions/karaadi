import prisma from "../core/utils/db.ts";

const defaultPlans = [
  {
    name: "Basic",
    price: 0,
    durationDays: 30,
    maxListings: 5,
    categories: [],
    features: ["5 listings", "30 days visibility", "Basic support"],
    isActive: true,
  },
  {
    name: "Standard",
    price: 49,
    durationDays: 60,
    maxListings: 20,
    categories: [],
    features: ["20 listings", "60 days visibility", "Priority support", "Featured badge"],
    isActive: true,
  },
  {
    name: "Premium",
    price: 99,
    durationDays: 90,
    maxListings: 50,
    categories: [],
    features: ["50 listings", "90 days visibility", "Dedicated support", "Featured badge", "Top placement"],
    isActive: true,
  },
];

export async function seedBusinessPlans() {
  for (const plan of defaultPlans) {
    const existing = await (prisma as any).businessPlan.findFirst({
      where: { name: plan.name },
    });
    if (!existing) {
      await (prisma as any).businessPlan.create({ data: plan });
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedBusinessPlans()
    .catch(console.error)
    .finally(() => process.exit());
}
