"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";
import { useAuth } from "@/context/AuthContext";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/nesSubCategoryLinks";

import type { CreateJobData } from "@/actions/categories/jobActions";
import { createJob } from "@/actions/categories/jobActions";

type Region = {
  id: string;
  name: string;
  so?: string;
};

type City = {
  id: string;
  name: string;
  regionId: string;
  so?: string;
};

type ExperienceLevel = {
  key: string;
  name: string;
  labelKey: string;
  icon: React.ReactNode;
  href: string;
};

type EducationLevel = {
  key: string;
  name: string;
  labelKey: string;
  icon: React.ReactNode;
  href: string;
};

const CreateAdForJobs = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateJobData>({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: 0,
    type: "Full-time",
    city: "",
    region: "",
    isPaid: true,
  });

  const [additionalData, setAdditionalData] = useState({
    experienceLevel: "",
    educationLevel: "",
    applicationDeadline: "",
    salaryRange: "",
  });

  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [newCitySo, setNewCitySo] = useState("");

  useEffect(() => {
    const initPage = async () => {
      const [regs, cts] = await Promise.all([getAllRegions(), getAllCities()]);
      setRegions(regs || []);
      setAllCities(cts || []);
    };
    initPage();
  }, []);

  useEffect(() => {
    if (formData.region) {
      const filtered = allCities.filter((c) => c.regionId === formData.region);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [formData.region, allCities]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name in formData) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setAdditionalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCityChange = (value: string) => {
    if (value === "custom") {
      setShowNewCityInputs(true);
      setFormData((prev) => ({ ...prev, city: "" }));
    } else {
      setShowNewCityInputs(false);
      setFormData((prev) => ({ ...prev, city: value }));
      setNewCityName("");
      setNewCitySo("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalCity = formData.city;
      if (showNewCityInputs && newCityName.trim()) {
        const cityPayload = {
          id: newCityName.trim().toLowerCase().replace(/\s+/g, "-"),
          name: newCityName,
          regionId: formData.region,
          isActive: true,
        };
        await addCity(cityPayload);
        finalCity = newCityName;
      }

      const selectedRegion = regions.find((r) => r.id === formData.region);
      const salaryAmount =
        parseInt(additionalData.salaryRange.replace(/[^0-9]/g, "")) || 0;

      const jobData: CreateJobData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: `${selectedRegion?.name || formData.region}, ${finalCity}`,
        salary: salaryAmount,
        type: formData.type,
        city: finalCity,
        region: selectedRegion?.name || formData.region,
        isPaid: formData.isPaid,
      };

      const res = await createJob(jobData);

      if (res.success) {
        toast.success("Job advertisement posted successfully!");
        router.push("/jobs");
      } else {
        toast.error(res.message || "Failed to post job.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceLevels = nesCategories.experienceLevels || [];
  const educationLevels = nesCategories.educationLevels || [];

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 text-blue-800 text-center">
        {t("jobsPage.title", "Post a Job")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("jobsPage.application.companyName", "Company Name")}
            </label>
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t(
                "jobsPage.application.companyName",
                "Company Name",
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("jobsPage.application.jobTitle", "Job Title")}
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t("jobsPage.application.jobTitle", "Job Title")}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("jobsPage.application.experienceLevel", "Experience Level")}
            </label>
            <select
              name="experienceLevel"
              value={additionalData.experienceLevel}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">
                {t(
                  "jobsPage.application.selectExperience",
                  "Select Experience",
                )}
              </option>
              {experienceLevels.map((level: ExperienceLevel) => (
                <option key={level.key} value={level.key}>
                  {t(level.labelKey, level.name)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("jobsPage.application.educationLevel", "Education Level")}
            </label>
            <select
              name="educationLevel"
              value={additionalData.educationLevel}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">
                {t("jobsPage.application.selectEducation", "Select Education")}
              </option>
              {educationLevels.map((level: EducationLevel) => (
                <option key={level.key} value={level.key}>
                  {t(level.labelKey, level.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("createAd.selectRegion", "Region")}
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">
                {t("createAd.selectRegion", "Select Region")}
              </option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {i18n.language === "so" ? r.so || r.name : r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("createAd.selectCity", "City")}
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              required={!showNewCityInputs}
              disabled={!formData.region}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            >
              <option value="">
                {t("createAd.selectCity", "Select City")}
              </option>
              {filteredCities.map((c) => (
                <option key={c.id} value={c.name}>
                  {i18n.language === "so" ? c.so || c.name : c.name}
                </option>
              ))}
              <option value="custom" className="text-blue-600 font-bold">
                {t("createAd.addCity", "+ Add New City")}
              </option>
            </select>
          </div>
        </div>

        {showNewCityInputs && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-dashed border-blue-300">
            <input
              placeholder={t("createAd.newCityPlaceholder", "City Name (EN)")}
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              required
              className="border p-2 rounded outline-none focus:border-blue-500"
            />
            <input
              placeholder={t("createAd.newCitySoPlaceholder", "City Name (SO)")}
              value={newCitySo}
              onChange={(e) => setNewCitySo(e.target.value)}
              className="border p-2 rounded outline-none focus:border-blue-500"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("jobsPage.application.salaryRange", "Salary Range")}
            </label>
            <input
              name="salaryRange"
              placeholder={t(
                "jobsPage.application.salaryPlaceholder",
                "e.g. $500 - $1000",
              )}
              value={additionalData.salaryRange}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t(
                "jobsPage.application.applicationDeadline",
                "Application Deadline",
              )}
            </label>
            <input
              type="date"
              name="applicationDeadline"
              value={additionalData.applicationDeadline}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("jobsPage.application.jobType", "Job Type")}
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("createFarmequipment.descriptionPlaceholder", "Description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
            placeholder={t(
              "jobsPage.application.descriptionPlaceholder",
              "Job description...",
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          {isSubmitting
            ? t("createAd.submitting", "Posting...")
            : t("jobsPage.postJob", "Post Job Advertisement")}
        </button>
      </form>
    </div>
  );
};

export default CreateAdForJobs;
