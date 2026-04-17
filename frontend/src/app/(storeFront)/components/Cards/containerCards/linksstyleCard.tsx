"use client";

import { COLORS } from "@/app/utils/colors/colors";
import React from "react";
import { useTranslation } from "react-i18next";

interface LinksStyleCardProps {
  title?: React.ReactNode;
  name?: string;
  icon?: React.ReactNode;
  isSmartsuuq?: boolean;
  isActive?: boolean;
  size?: "sm" | "md";
}

const getStyles = (isActive: boolean, size: "sm" | "md") => {
  const isSmall = size === "sm";
  return {
    card: {
      backgroundColor: isActive ? COLORS.primary : COLORS.white,
      borderRadius: 8,
      padding: isSmall ? "8px 6px" : "12px 10px",
      minHeight: isSmall ? "52px" : "70px",
      border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      width: "100%",
      height: "100%",
      boxShadow: isActive
        ? "0 2px 4px rgba(0,0,0,0.1)"
        : "0 1px 2px rgba(0,0,0,0.05)",
      transition: "all 0.2s ease",
    },
    iconWrapper: {
      width: isSmall ? 26 : 38,
      height: isSmall ? 26 : 38,
      color: isActive ? COLORS.white : COLORS.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isSmall ? 16 : 20,
    },
    name: {
      fontSize: isSmall ? 12 : 14,
      fontWeight: "500" as const,
      color: isActive ? COLORS.white : COLORS.textPrimary,
      margin: 0,
      textAlign: "center" as const,
      lineHeight: 1.2,
    },
  };
};

function LinksStyleCard({
  title,
  name,
  icon,
  isActive,
  size = "md",
}: LinksStyleCardProps) {
  const { i18n } = useTranslation();
  const styles = getStyles(Boolean(isActive), size);
  const displayText = i18n?.language?.startsWith("so") && name ? name : title;

  return (
    <div style={styles.card}>
      {icon && <div style={styles.iconWrapper}>{icon}</div>}
      <h2 style={styles.name} suppressHydrationWarning>
        {displayText}
      </h2>
    </div>
  );
}

export default LinksStyleCard;
