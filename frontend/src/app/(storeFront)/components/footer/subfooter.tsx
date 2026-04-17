"use client";

import { FaFacebookF, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function SubFooter() {
  const { t } = useTranslation();

  return (
    <div className="text-gray-700 text-sm border-t border-b border-gray-300 bg-bg-FEFDFD">
      <div className="mx-auto w-full max-w-[59rem] px-6 py-8 mt-0 text-center space-y-6">
        <div>
          <h3 className="font-semibold mb-3">{t("footer.followUs")}</h3>
          <div className="flex justify-center space-x-6 text-xl text-gray-500">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.tiktok.com/@karaadi_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-black"
            >
              <FaTiktok />
            </a>
            {/* Instagram removed as requested */}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("footer.rights_short", { brand: "Karaadi" })}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            {t("footer.developedBy")}{" "}
            <a
              href="https://www.mohyus.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              Mohyus
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
