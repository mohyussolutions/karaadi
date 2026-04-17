"use client";
export const dynamic = "force-dynamic";

import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-xl border border-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
        {t("about.heading")}
      </h1>

      <p className="text-lg text-gray-700 mb-8 text-center">
        {t("about.lead")}
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
          {t("about.missionHeading")}
        </h2>
        <p className="text-gray-600 leading-relaxed">{t("about.mission")}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
          {t("about.whatHeading")}
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 pl-4">
          <li>{t("about.items.realEstate")}</li>
          <li>{t("about.items.vehicles")}</li>
          <li>{t("about.items.marketplace")}</li>
          <li>{t("about.items.jobs")}</li>
          <li>{t("about.items.services")}</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
          {t("about.contactHeading")}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {t("about.contactIntro")}
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-gray-700">
            {t("about.contact.emailLabel")}{" "}
            <a
              href="mailto:info@yourdomain.so"
              className="text-blue-600 hover:underline"
            >
              karaadiI2025@hotmail.com
            </a>
          </p>
          <p className="text-gray-700">
            {t("about.contact.phoneLabel")}{" "}
            <a
              href="tel:+ +252 61 3159205"
              className="text-blue-600 hover:underline"
            >
              +252 61 3159205
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
