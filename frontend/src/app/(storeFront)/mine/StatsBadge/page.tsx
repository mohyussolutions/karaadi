"use client";

import dynamic from "next/dynamic";
import Loading from "@/app/ui/loading/Loading";

const CartContent = dynamic(() => import("./CartContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loading />
    </div>
  ),
});

export default function CartPage() {
  return <CartContent />;
}
