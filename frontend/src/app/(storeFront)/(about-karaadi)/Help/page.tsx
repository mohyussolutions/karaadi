"use client";
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaComment,
  FaPhone,
  FaQuestionCircle,
  FaShoppingCart,
  FaDollarSign,
  FaTruck,
  FaWhatsapp,
} from "@/app/utils/icons";

function Help() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="text-center mb-12 sm:mb-20">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4 sm:mb-6 text-gray-800">
          {t("helpPage.hero.title")}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          {t("helpPage.hero.lead")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
        <div className="bg-white p-6 sm:p-8 border-2 border-blue-100 rounded-2xl shadow-xl">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <FaEnvelope className="text-xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                {t("helpPage.contactMethods.email.title")}
              </h2>
              <p className="text-gray-600 text-sm">
                {t("helpPage.contactMethods.email.desc")}
              </p>
            </div>
          </div>
          <a
            href={t("helpPage.contactMethods.email.address")}
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium text-base w-full text-center shadow-md"
          >
            <FaEnvelope className="mr-2" />
            {t("helpPage.contactMethods.email.address")}
          </a>
        </div>

        <div className="bg-white p-6 sm:p-8 border-2 border-green-100 rounded-2xl shadow-xl">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-xl mr-4">
              <FaComment className="text-xl text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                {t("helpPage.contactMethods.directMessage.title")}
              </h2>
              <p className="text-gray-600 text-sm">
                {t("helpPage.contactMethods.directMessage.desc")}
              </p>
            </div>
          </div>
          <Link
            href={t("helpPage.contactMethods.directMessage.link")}
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-medium text-base w-full text-center shadow-md"
          >
            <FaComment className="mr-2" />
            {t("helpPage.contactMethods.directMessage.cta")}
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 border-2 border-green-100 rounded-2xl shadow-xl">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-xl mr-4">
              <FaWhatsapp className="text-xl text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                {t("helpPage.contactMethods.whatsapp.title")}
              </h2>
              <p className="text-gray-600 text-sm">
                {t("helpPage.contactMethods.whatsapp.desc")}
              </p>
            </div>
          </div>
          <a
            href={t("helpPage.contactMethods.whatsapp.link")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-medium text-base w-full text-center shadow-md"
          >
            <FaWhatsapp className="mr-2" />
            {t("helpPage.contactMethods.whatsapp.cta")}
          </a>
        </div>
      </div>

      <div className="mb-16 sm:mb-24">
        <h2 className="text-2xl sm:text-3xl font-medium mb-8 sm:mb-12 text-center text-gray-800">
          {t("helpPage.faqsTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FaShoppingCart className="text-xl text-blue-500 mr-3" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                {t("helpPage.faqs.0.q")}
              </h3>
            </div>
            <p className="text-gray-600">{t("helpPage.faqs.0.a")}</p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FaQuestionCircle className="text-xl text-blue-500 mr-3" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                {t("helpPage.faqs.1.q")}
              </h3>
            </div>
            <p className="text-gray-600">{t("helpPage.faqs.1.a")}</p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FaDollarSign className="text-xl text-blue-500 mr-3" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                {t("helpPage.faqs.2.q")}
              </h3>
            </div>
            <p className="text-gray-600">{t("helpPage.faqs.2.a")}</p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FaTruck className="text-xl text-blue-500 mr-3" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                {t("helpPage.faqs.3.q")}
              </h3>
            </div>
            <p className="text-gray-600">{t("helpPage.faqs.3.a")}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-8 sm:p-12 text-white">
        <div className="text-center">
          <div className="inline-block bg-white p-4 rounded-full mb-5 shadow-lg">
            <FaPhone className="text-3xl text-blue-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium mb-4">
            {t("helpPage.urgent.title")}
          </h2>
          <p className="text-lg mb-5 opacity-90">
            {t(
              "helpPage.urgent.lead",
              "If you need quick help or found an issue",
            )}
          </p>
          <div className="inline-flex items-center bg-white text-blue-500 px-6 py-3 rounded-xl mb-4">
            <FaPhone className="mr-2 text-xl" />
            <span className="text-2xl sm:text-3xl font-medium">
              {t("helpPage.urgent.phone")}
            </span>
          </div>
          <p className="text-gray-200">{t("helpPage.urgent.hours")}</p>
        </div>
      </div>

      <div className="mt-12 sm:mt-20 text-center">
        <p className="text-gray-500">{t("helpPage.footerNote")}</p>
      </div>
    </div>
  );
}

export default Help;
