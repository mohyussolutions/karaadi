import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/store/store";

export default function PersistWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
