"use client";

import React, { useState } from "react";
import { FaPaperPlane, FaEdit } from "@/app/utils/icons";
import { useTranslation } from "react-i18next";

export interface AppyProps {
  jobTitle: string;
  companyName: string;
  jobId: string;
}

export default function Appy({ jobTitle, companyName, jobId }: AppyProps) {
  const { t } = useTranslation();

  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitted"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus("submitted");
  };

  if (submissionStatus === "submitted") {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <div className="p-8 border-2 border-green-400 rounded-xl text-center w-full max-w-lg">
          <h3 className="text-3xl font-bold text-green-700 mb-2">
            {t("jobsPage.applicationSuccess")}
          </h3>
          <p className="text-gray-700 mb-4">
            Mahadsanid codsigaaga shaqada: <strong>{jobTitle}</strong> ee{" "}
            <strong>{companyName}</strong>. Waxaanu ku soo laaban doonaa sida
            ugu dhaqsaha badan.
          </p>
          <button
            onClick={() => setSubmissionStatus("idle")}
            className="px-6 py-2 flex items-center justify-center mx-auto text-base bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            <FaEdit className="mr-2" /> Edit Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-full max-w-3xl p-8 rounded-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 border-b pb-2">
          {t("jobsPage.application.applyFor", { title: jobTitle })}
        </h2>
        <p className="text-xl text-indigo-600 font-medium mb-8">
          {companyName}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
            {t("jobsPage.application.personalInformation")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                {t("jobsPage.application.fullNameLabel")}
              </label>
              <input
                type="text"
                id="fullName"
                required
                placeholder={t("jobsPage.application.fullNamePlaceholder")}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                {t("jobsPage.application.emailLabel")}
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder={t("jobsPage.application.emailPlaceholder")}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                {t("jobsPage.application.phoneLabel")}
              </label>
              <input
                type="tel"
                id="phone"
                required
                placeholder={t("jobsPage.application.phonePlaceholder")}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="linkedin"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                {t("jobsPage.application.linkedinLabel")}
              </label>
              <input
                type="url"
                id="linkedin"
                placeholder={t("jobsPage.application.linkedinPlaceholder")}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 pt-4">
            Documents
          </h3>

          <div>
            <label
              htmlFor="resume"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              {t("jobsPage.application.uploadResume")}
            </label>
            <input
              type="file"
              id="resume"
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:text-indigo-700"
            />
          </div>

          <div>
            <label
              htmlFor="coverLetter"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              {t("jobsPage.application.coverLetterLabel")}
            </label>
            <textarea
              id="coverLetter"
              rows={5}
              placeholder={t("jobsPage.application.coverLetterPlaceholder")}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 pt-4">
            {t("jobsPage.application.voluntary")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="gender"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                {t("jobsPage.application.genderLabel")}
              </label>
              <select
                id="gender"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">
                  {t("jobsPage.application.genderPlaceholder")}
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01] mt-8"
          >
            <FaPaperPlane className="mr-3" />
            {t("jobsPage.application.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
