"use client";
import { useTranslation } from "react-i18next";
import { OptionButton } from "../../components/shared/buttons/OptionButton";

interface OptionItem {
  key: string;
  name: string;
  labelKey: string;
  icon?: React.ReactNode;
  href?: string;
  title?: string;
  description?: string;
}

interface AdOptionsProps {
  selectedCategory: string | null;
  options: OptionItem[];
  onOptionSelect: (optionTitle: string) => void;
}

export function AdOptions({
  selectedCategory,
  options,
  onOptionSelect,
}: AdOptionsProps) {
  useTranslation();

  if (!selectedCategory) {
    return null;
  }

  return (
    <div className="w-full md:w-1/2">
      <div className="space-y-6">
        {options.map((item) => (
          <div
            key={item.key}
            className="flex flex-col space-y-2 border rounded-md p-4"
          >
            <OptionButton
              title={item.title || item.name}
              onSelect={() => onOptionSelect(item.title || item.name)}
              disabled={false}
            >
              {item.title || item.name}
            </OptionButton>
          </div>
        ))}
      </div>
    </div>
  );
}
