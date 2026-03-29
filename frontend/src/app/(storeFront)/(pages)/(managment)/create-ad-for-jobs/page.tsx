"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import type { NormalizedUser } from "@/app/utils/types/user.types";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";
import { verifySession } from "@/actions/core/authAction";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import {
  applicationMethods,
  educationLevels,
  experienceLevels,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForJobs";
import { createJob } from "@/actions/categories/jobActions";

const CreateAdForJobs = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<NormalizedUser | null>(null);
  const [token, setToken] = useState("");
  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    mainCategory: "Jobs",
    jobType: "",
    region: "",
    city: "",
    description: "",
    salaryRange: "",
    companyName: "",
    experienceLevel: "",
    educationLevel: "",
    requiredSkills: "",
    applicationMethod: "",
    applicationContact: "",
    applicationDeadline: "",
    newCityName: "",
    newCitySo: "",
  });

  const [showNewCityInputs, setShowNewCityInputs] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      const session = await verifySession();
      if (!session) {
        toast.info("Please log in.");
        router.push("/login");
        return;
      }
      setCurrentUser(session);
      setToken(localStorage.getItem("userToken") || "");

      const [regs, cts] = await Promise.all([getAllRegions(), getAllCities()]);
      setRegions(regs || []);
      setAllCities(cts || []);
    };
    initPage();
  }, [router]);

  useEffect(() => {
    if (formData.region) {
      const filtered = allCities
        .filter((c) => c.regionId === formData.region)
        .map((c) => c.name);
      setFilteredCities(filtered);
    }
  }, [formData.region, allCities]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (value: string) => {
    if (value === "custom") {
      setShowNewCityInputs(true);
      setFormData((prev) => ({ ...prev, city: "" }));
    } else {
      setShowNewCityInputs(false);
      setFormData((prev) => ({
        ...prev,
        city: value,
        newCityName: "",
        newCitySo: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalCity = formData.city;
      if (showNewCityInputs) {
        const newCityData = {
          id: "",
          name: formData.newCityName,
          regionId: formData.region,
          isActive: true,
        };

        await addCity(
          formData.newCityName,
          formData.newCitySo,
          formData.region,
          newCityData,
        );
        finalCity = formData.newCityName;
      }

      const jobData = {
        title: formData.title,
        description: formData.description,
        location: `${formData.region}, ${finalCity}`,
        company: formData.companyName,
        salary: parseInt(formData.salaryRange.replace(/[^0-9]/g, "")) || 0,
        type: formData.jobType as any,
        experienceLevel: formData.experienceLevel,
        educationLevel: formData.educationLevel,
        applicationMethod: formData.applicationMethod,
        applicationContact: formData.applicationContact,
        deadline: formData.applicationDeadline,
        requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
      };

      const res = await createJob(jobData as any, token);

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

  if (!currentUser) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 text-blue-800 text-center">
        Post a Job
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Experience</option>
              {experienceLevels.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Education Level
            </label>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Education</option>
              {educationLevels.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Region</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <select
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              required={!showNewCityInputs}
              disabled={!formData.region}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            >
              <option value="">Select City</option>
              {filteredCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="custom" className="text-blue-600 font-bold">
                Add New City +
              </option>
            </select>
          </div>
        </div>

        {showNewCityInputs && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-dashed border-blue-300">
            <input
              name="newCityName"
              placeholder="City Name (EN)"
              value={formData.newCityName}
              onChange={handleChange}
              required
              className="border p-2 rounded outline-none focus:border-blue-500"
            />
            <input
              name="newCitySo"
              placeholder="City Name (SO)"
              value={formData.newCitySo}
              onChange={handleChange}
              className="border p-2 rounded outline-none focus:border-blue-500"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Salary Range
            </label>
            <input
              name="salaryRange"
              placeholder="e.g. $500 - $1000"
              value={formData.salaryRange}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          {isSubmitting ? "Posting..." : "Post Job Advertisement"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdForJobs;
