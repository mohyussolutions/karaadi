import { User, Ship, ShieldCheck, CreditCard } from "lucide-react";

export const CHECKOUT_STEPS_CONFIG = [
  { id: "step1", name: "Account", href: "/login", icon: User },
  { id: "step2", name: "New Ad", href: "/new-ad", icon: Ship },
  { id: "step3", name: "Summary", href: "/summary", icon: ShieldCheck },
  { id: "step4", name: "Payment", href: "/payment", icon: CreditCard },
];
