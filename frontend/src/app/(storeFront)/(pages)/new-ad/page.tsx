"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

import { useAdOptions } from "../../components/hooks/useAdOptions";
import { useAdNavigation } from "../../components/hooks/useAdNavigation";
import router from "next/router";
import { AdOptions } from "./AdOptions";
import { CategoryList } from "./CategoryList";

function Ads() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openModel, setOpenModel] = useState(false);
  const { user, loading } = useAuth();
  const { handleOptionSelect } = useAdNavigation();
  const { currentOptions } = useAdOptions(selectedCategory);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory !== categoryName) {
      setSelectedCategory(categoryName);
      setOpenModel(true);
    } else {
      setOpenModel((prev) => !prev);
    }
  };

  const handleSelect = (optionTitle: string) => {
    setOpenModel(false);
    handleOptionSelect(optionTitle, selectedCategory);
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="border bg-gray-90 min-h-[45rem] m-4 rounded-lg">
      <div className="bg-gray-10 flex flex-col md:flex-row md:items-start md:justify-start gap-5 p-5 rounded-lg">
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryClick}
          isOpen={openModel}
        />

        <AdOptions
          selectedCategory={selectedCategory}
          options={currentOptions}
          onOptionSelect={handleSelect}
        />
      </div>
    </div>
  );
}

export default Ads;
