"use client";

import { memo } from "react";
import { IoMdArrowDropdown, TiArrowSortedUp } from "@/app/utils/icons";

interface CategoryItemProps {
  name: string;
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  isOpen: boolean;
  onSelect: (name: string) => void;
}

function CategoryItemComponent({
  name,
  icon,
  label,
  isSelected,
  isOpen,
  onSelect,
}: CategoryItemProps) {
  const handleClick = () => {
    onSelect(name);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between p-2 bg-white hover:bg-gray-10 rounded-lg cursor-pointer text-left ${
        isSelected ? "text-blue-500 font-semibold" : "text-gray-800"
      }`}
    >
      <span className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </span>
      {isSelected && isOpen ? (
        <TiArrowSortedUp className="text-xl" />
      ) : (
        <IoMdArrowDropdown className="text-xl" />
      )}
    </div>
  );
}

CategoryItemComponent.displayName = "CategoryItem";

export const CategoryItem = memo(CategoryItemComponent);
