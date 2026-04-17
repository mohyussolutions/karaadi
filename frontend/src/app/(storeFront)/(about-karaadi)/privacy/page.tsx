"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { useTranslation } from "react-i18next";

function Privacy() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#444",
          fontSize: "1rem",
          lineHeight: "1.8",
          maxWidth: "800px",
        }}
      >
        <h1 style={{ color: "#222", marginBottom: "1.5rem" }}>
          {t("privacyPage.title")}
        </h1>

        <section>
          <section>
            <h2 style={{ color: "#333", fontSize: "1.3rem" }}>
              {t("privacyPage.sections.collectionTitle")}
            </h2>
            <p>{t("privacyPage.sections.collection")}</p>
          </section>
        </section>

        <hr
          style={{
            margin: "2rem auto",
            width: "30%",
            border: "0",
            borderTop: "1px solid #ddd",
          }}
        />

        <section>
          <h2 style={{ color: "#333", fontSize: "1.3rem" }}>
            {t("privacyPage.sections.usageTitle")}
          </h2>
          <p>{t("privacyPage.sections.usage")}</p>
        </section>

        <hr
          style={{
            margin: "2rem auto",
            width: "30%",
            border: "0",
            borderTop: "1px solid #ddd",
          }}
        />

        <section>
          <h2 style={{ color: "#333", fontSize: "1.3rem" }}>
            {t("privacyPage.sections.rightsTitle")}
          </h2>
          <p>{t("privacyPage.sections.rights")}</p>
        </section>

        <hr
          style={{
            margin: "2rem auto",
            width: "30%",
            border: "0",
            borderTop: "1px solid #ddd",
          }}
        />

        <section>
          <h2 style={{ color: "#333", fontSize: "1.3rem" }}>
            {t("privacyPage.sections.securityTitle")}
          </h2>
          <p>{t("privacyPage.sections.security")}</p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
