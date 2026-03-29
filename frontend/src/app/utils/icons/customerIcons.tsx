"use client";

import { IconType } from "react-icons";
import { useTranslation } from "react-i18next";

export const MohyusLogoIcon: IconType = (props) => {
  const { t } = useTranslation();
  const { size = 60, ...rest } = props as { size?: number | string };

  return (
    <img
      src="/logo.jpg"
      alt={t("mohyusLogoAlt", { defaultValue: "Mohyus Logo" })}
      width={size}
      height={size}
      style={{ display: "inline-block" }}
      {...rest}
    />
  );
};
