"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export const useError = () => {
  const { t } = useTranslation();

  const renderError = (isError: boolean) => {
    if (!isError) return null;

    return (
      <div className="text-red-500 p-10 text-center font-bold">
        {t("marketplace.error_loading", {
          defaultValue: "Cilad ayaa ku timid soo dejinta alaabta.",
        })}
      </div>
    );
  };

  return { renderError };
};
