"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { getAllRegions, getAllCities } from "@/actions/categories/geoAction";
import CitySelect from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import { useAuth } from "@/context/AuthContext";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import type { CreateJobData } from "@/actions/categories/jobActions";
import { createJob } from "@/actions/categories/jobActions";
import SelectField from "./SelectField";

type Region = { id: string; name: string };
type City = { id: string; name: string; regionId: string };

export default function JobsForm({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    jobType: "",
    region: "",
    city: "",
    description: "",
    salaryRange: "",
    companyName: "",
    experienceLevel: "",
    educationLevel: "",
    applicationDeadline: "",
  });

  useEffect(() => {
    const init = async () => {
      if (!currentUser) { router.push("/login"); return; }
      const [regs, cts] = await Promise.all([getAllRegions(), getAllCities()]);
      setRegions(regs || []);
      setAllCities(cts || []);
    };
    init();
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedRegion = regions.find((r) => r.id === formData.region);
      const salaryAmount = parseInt(formData.salaryRange.replace(/[^0-9]/g, "")) || 0;
      const jobData: CreateJobData = {
        title: formData.title,
        description: formData.description,
        company: formData.companyName,
        location: `${selectedRegion?.name || formData.region}, ${formData.city}`,
        salary: salaryAmount,
        type: formData.jobType || "Full-time",
        city: formData.city,
        region: selectedRegion?.name || formData.region,
        isPaid: true,
      };
      const res = await createJob(jobData);
      if (res.success) {
        toast.success("Job advertisement posted successfully!");
        onNext();
      } else {
        toast.error(res.data?.message || "Failed to post job.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return <div className="p-10 text-center">Loading...</div>;

  const experienceLevels = (nesCategories.experienceLevels || []).map((l: any) => ({ value: l.key, label: String(t(l.labelKey, l.name)) }));
  const educationLevels = (nesCategories.educationLevels || []).map((l: any) => ({ value: l.key, label: String(t(l.labelKey, l.name)) }));
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-blue-800 text-center">{t("jobsPage.title", "Post a Job")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">{t("jobsPage.application.companyName", "Company Name")}</label>
            <input name="companyName" value={formData.companyName} onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))} required maxLength={100} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t("jobsPage.application.companyName", "Company Name")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("jobsPage.application.jobTitle", "Job Title")}</label>
            <input name="title" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required maxLength={200} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t("jobsPage.application.jobTitle", "Job Title")} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">{t("jobsPage.application.experienceLevel", "Experience Level")}</label>
            <SelectField value={formData.experienceLevel} onChange={(v) => setFormData((p) => ({ ...p, experienceLevel: v }))} options={experienceLevels} placeholder={t("jobsPage.application.selectExperience", "Select Experience")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("jobsPage.application.educationLevel", "Education Level")}</label>
            <SelectField value={formData.educationLevel} onChange={(v) => setFormData((p) => ({ ...p, educationLevel: v }))} options={educationLevels} placeholder={t("jobsPage.application.selectEducation", "Select Education")} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">{t("createAd.selectRegion", "Region")}</label>
            <SelectField value={formData.region} onChange={(v) => setFormData((p) => ({ ...p, region: v, city: "" }))} options={regionOptions} placeholder={t("createAd.selectRegion", "Select Region")} />
          </div>
          <CitySelect regionId={formData.region} cities={allCities} value={formData.city} onChange={(name) => setFormData((p) => ({ ...p, city: name }))} onCitiesUpdate={(u) => setAllCities(u as City[])} disabled={!formData.region} label={t("createAd.selectCity", "City")} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">{t("jobsPage.application.salaryRange", "Salary Range")}</label>
            <input name="salaryRange" placeholder={t("jobsPage.application.salaryPlaceholder", "e.g. $500 - $1000")} value={formData.salaryRange} onChange={(e) => setFormData((p) => ({ ...p, salaryRange: e.target.value }))} maxLength={100} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("jobsPage.application.applicationDeadline", "Application Deadline")}</label>
            <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={(e) => setFormData((p) => ({ ...p, applicationDeadline: e.target.value }))} required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("createFarmequipment.descriptionPlaceholder", "Description")}</label>
          <textarea name="description" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={5} maxLength={5000} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required placeholder={t("jobsPage.application.descriptionPlaceholder", "Job description...")} />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wide">
          {isSubmitting ? t("createAd.submitting", "Posting...") : t("jobsPage.postJob", "Post Job Advertisement")}
        </button>
      </form>
    </div>
  );
}
