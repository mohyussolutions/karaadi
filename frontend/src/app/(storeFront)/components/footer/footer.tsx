"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const getCurrentYear = () => new Date().getFullYear();

  return (
    <footer className="text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-b border-gray-300">
        <div>
          <h3 className="font-semibold mb-3">{t("footer.company")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-blue-600">
                {t("footer.about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">
                {t("footer.contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.support")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="hover:text-blue-600">
                {t("footer.helpCenter")}
              </Link>
            </li>
            <li>
              <Link href="/Terms" className="hover:text-blue-600">
                {t("footer.terms")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.categories")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/Marketplace" className="hover:text-blue-600">
                {t("footer.marketplace")}
              </Link>
            </li>
            <li>
              <Link href="/real-estate" className="hover:text-blue-600">
                {t("footer.realEstate")}
              </Link>
            </li>
            <li>
              <Link href="/cars" className="hover:text-blue-600">
                {t("footer.cars")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.legal")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="hover:text-blue-600">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-blue-600">
                {t("footer.cookies")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[59rem] px-6 py-8 mt-0 text-center text-sm text-gray-600">
        {t("footer.rights", {
          yearStart: 2025,
          yearEnd: getCurrentYear(),
          brand: "Karaadi",
        })}
      </div>
    </footer>
  );
}
