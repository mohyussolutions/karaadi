"use client";

import { memo } from "react";

interface OptionButtonProps {
  title: string;
  onSelect: (title: string) => void;
  disabled: boolean;
  children: React.ReactNode;
}

function OptionButtonComponent({
  title,
  onSelect,
  disabled,
  children,
}: OptionButtonProps) {
  const handleClick = () => {
    onSelect(title);
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className="px-4 mt-2 py-2 rounded-lg text-left bg-white hover:bg-gray-200 text-gray-800 w-full disabled:opacity-50"
    >
      <span className="block">{children}</span>
    </button>
  );
}

OptionButtonComponent.displayName = "OptionButton";

export const OptionButton = memo(OptionButtonComponent);
