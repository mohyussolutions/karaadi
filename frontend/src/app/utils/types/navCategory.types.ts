import React from "react";

export interface Category {
  key: string;
  href: string;
  name: string;
  labelKey?: string;
  logo?: string;
  icon?: React.ReactNode;
  hideIcon?: boolean;
}

export const EXTERNAL_LINK_REGEX = /^https?:\/\//;

export const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export const IMAGE_SIZES = "(max-width: 640px) 24px, 32px";
