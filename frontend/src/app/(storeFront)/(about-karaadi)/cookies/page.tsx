"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { useTranslation } from "react-i18next";

export default function CookiesPage() {
  const { t } = useTranslation();
  const paragraphs = t("cookiesPage.paragraphs", {
    returnObjects: true,
  }) as string[];

  return (
    <main
      style={{
        padding: "3rem 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <div style={{ maxWidth: 760, width: "100%" }}>
        <article
          style={{
            textAlign: "left",
            color: "#444",
            fontSize: "0.95rem",
            lineHeight: "1.7",
          }}
        >
          <h2
            style={{ color: "#222", marginBottom: "1rem", fontSize: "1.2rem" }}
          >
            {t("cookiesPage.heading")}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: "1rem" }}>
              {p}
            </p>
          ))}
        </article>
      </div>
    </main>
  );
}
