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
    "flex flex-col items-center justify-center w-full h-full rounded-lg border gap-1 transition-all duration-200",
    isSm ? "py-2 px-1.5 min-h-[52px]" : "py-3 px-2.5 min-h-[70px]",
    isActive
      ? "bg-blue-500 border-blue-500 shadow-md"
      : "bg-white border-gray-200 shadow-sm hover:border-blue-300 hover:shadow",
  ].join(" ");

  const iconWrapper = [
    "flex items-center justify-center",
    isSm ? "w-[26px] h-[26px] text-base" : "w-[38px] h-[38px] text-xl",
    isActive ? "text-white" : "text-blue-500",
  ].join(" ");

  const name = [
    "font-medium text-center leading-tight m-0",
    isSm ? "text-xs" : "text-sm",
    isActive ? "text-white" : "text-gray-900",
  ].join(" ");

  return (
    <div className={card}>
      {icon && <div className={iconWrapper}>{icon}</div>}
      <h2 className={name} suppressHydrationWarning>
        {title}
      </h2>
    </div>
  );
}

export default LinksStyleCard;
