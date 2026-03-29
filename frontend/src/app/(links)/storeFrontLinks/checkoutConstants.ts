import { User, Ship, ShieldCheck, CreditCard } from "lucide-react";

export const CHECKOUT_STEPS_CONFIG = [
  {
    id: "step1",
    name: "Account",
    href: "/login",
    icon: User,
    labelKey: "checkout.steps.account",
  },
  {
    id: "step2",
    name: "New Ad",
    href: "/new-ad",
    icon: Ship,
    labelKey: "checkout.steps.newAd",
  },
  {
    id: "step3",
    name: "Summary",
    href: "/summary",
    icon: ShieldCheck,
    labelKey: "checkout.steps.summary",
  },
  {
    id: "step4",
    name: "Payment",
    href: "/payment",
    icon: CreditCard,
    labelKey: "checkout.steps.payment",
  },
];
