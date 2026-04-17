"use client";

import Image from "next/image";
import { IconType } from "react-icons";
import { useTranslation } from "react-i18next";

export const MohyusLogoIcon: IconType = (props) => {
  const { t } = useTranslation();

  const { size, className } = props;
  const parsedSize = Number(size) || 60;

  return (
    <Image
      src="/logo.jpg"
      alt={t("mohyusLogoAlt", { defaultValue: "Mohyus Logo" })}
      width={parsedSize}
      height={parsedSize}
      className={`inline-block ${className || ""}`}
      style={{ width: "auto", height: "auto" }}
    />
  );
};
