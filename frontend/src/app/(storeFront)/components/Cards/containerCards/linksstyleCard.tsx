"use client";

import React from "react";

interface LinksStyleCardProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  isActive?: boolean;
  size?: "sm" | "md";
}

function LinksStyleCard({
  title,
  icon,
  isActive = false,
  size = "md",
}: LinksStyleCardProps) {
  const isSm = size === "sm";

  const card = [
    "flex flex-col items-center justify-center w-full h-full",
    "rounded-2xl border-2 gap-1.5 transition-all duration-150",
    isSm ? "py-2 px-2 min-h-[64px]" : "py-3 px-2 min-h-[80px]",
    isActive
      ? "border-blue-600 bg-blue-600 shadow-sm scale-[1.02]"
      : "border-gray-100 bg-white hover:bg-blue-600 hover:border-blue-600 hover:shadow-md active:scale-[0.97]",
  ].join(" ");

  const bubble = [
    "flex items-center justify-center flex-shrink-0 rounded-xl leading-none",
    isSm ? "w-8 h-8 text-[18px]" : "w-10 h-10 text-[22px]",
    isActive ? "text-white" : "text-blue-500 group-hover:text-white",
  ].join(" ");

  const name = [
    "font-bold text-center leading-tight m-0",
    isSm ? "text-[10px]" : "text-[11px]",
    isActive ? "text-white" : "text-gray-600 group-hover:text-white",
  ].join(" ");

  return (
    <div className={card}>
      {icon && (
        <div className={bubble} suppressHydrationWarning>
          {icon}
        </div>
      )}
      <p className={name} suppressHydrationWarning>
        {title}
      </p>
    </div>
  );
}

export default LinksStyleCard;
