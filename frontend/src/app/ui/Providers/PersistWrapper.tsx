import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/store/store";

export default function PersistWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistGate loading={<>{children}</>} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
