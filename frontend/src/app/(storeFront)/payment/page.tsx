"use client";

import React, { Suspense } from "react";
import PaymentContent from "./PaymentContent";

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600">
            eeeeee
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
