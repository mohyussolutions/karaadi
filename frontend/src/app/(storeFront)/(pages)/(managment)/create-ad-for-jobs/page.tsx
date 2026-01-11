"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { User } from "@/app/utils/types/user";

// Ensure 'cities' is imported if it contains city data for filtering
import {
  regions,
  cities,
} from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/SomaliaRegions";
import { jobsSubCategories as jobsSubCategoriesFlat } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/subCategories";
import {
  applicationMethods,
  educationLevels,
  experienceLevels,
} from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedSubcategoryForJobs";
import { allCategories } from "@/app/(storeFront)/links/categories";
import { apiService } from "@/actions/core/authAction";

const CreateAdForJobs = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [mainCategory, setMainCategory] = useState("Jobs");
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobField, setJobField] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [experienceLevel, setExperienceLevel] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [applicationMethod, setApplicationMethod] = useState("");
  const [applicationContact, setApplicationContact] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  // State for dynamically filtered cities (array of strings: city names)
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // New states for custom city feature
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [newCitySo, setNewCitySo] = useState("");

  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm";
  const labelStyle =
    "block mb-2 font-medium text-gray-700 text-sm md:text-base";
  const sectionHeaderStyle =
    "text-xl font-semibold text-gray-800 border-b pb-2 mb-4";

  // Unified change handler for city
  const handleCityChange = (value: string) => {
    if (value === "custom") {
      setShowNewCityInputs(true);
      setCity(""); // Clear city state when custom is selected
    } else {
      setShowNewCityInputs(false);
      setNewCityName("");
      setNewCitySo("");
      setCity(value);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionUser = await apiService.verifySession();
        if (!sessionUser) {
          toast.info("Please log in to post a job advertisement.");
          router.push("/login");
        } else {
          setCurrentUser(sessionUser);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (jobType) {
      const selectedJob = jobsSubCategoriesFlat.find(
        (job) => job.key === jobType
      );
      setJobField(selectedJob?.title || "");

      const jobTitlePart = selectedJob?.so || selectedJob?.title || jobType;

      setTitle(`Job: [${jobTitlePart}] - ${companyName || ""}`);
    } else {
      setJobField("");
      setTitle("");
    }
  }, [jobType, companyName]);

  // New useEffect to filter cities when region changes
  useEffect(() => {
    if (region) {
      // Assuming 'cities' is an array of objects, each having a 'regionId' property and 'name' property
      const citiesInRegion = cities
        .filter((city) => city.regionId === region)
        .map((city) => city.name); // Map to array of city names (strings)
      setFilteredCities(citiesInRegion);
    } else {
      setFilteredCities([]);
    }
    // Reset city selection and custom inputs when region changes
    setCity("");
    setShowNewCityInputs(false);
    setNewCityName("");
    setNewCitySo("");
  }, [region]);

  const isFormValid = () => {
    // Check if basic fields are valid, then check city/custom city validity
    const baseValid =
      mainCategory &&
      title &&
      jobType &&
      jobField &&
      region &&
      description &&
      salaryRange &&
      companyName &&
      experienceLevel &&
      educationLevel &&
      applicationMethod &&
      applicationContact &&
      applicationDeadline &&
      currentUser &&
      currentUser._id;

    const cityValid = showNewCityInputs
      ? newCityName.trim().length > 0 // Required if custom input is shown
      : city.length > 0; // Required if custom input is not shown

    return baseValid && cityValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Determine the city value to submit
    let finalCity = city;
    if (showNewCityInputs) {
      if (!newCityName) {
        toast.error("Please enter the new city name.");
        return;
      }
      // Use the custom city name for submission
      finalCity = newCityName;
    }

    if (!isFormValid()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const jobAdData = {
        title,
        description,
        category: mainCategory,
        subCategory: jobType,
        region,
        city: finalCity, // Use the determined city value
        // Include newCitySo if you need to pass the Somali name to the backend
        newCitySo: showNewCityInputs ? newCitySo : undefined,
        salaryRange,
        jobType: jobType,
        companyName,
        experienceLevel,
        educationLevel,
        requiredSkills: requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        applicationMethod,
        applicationContact,
        applicationDeadline,
        user: currentUser!._id,
        so: jobField,
      };

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Job Ad Submitted:", jobAdData);

      toast.success("Job advertisement posted successfully!");
    } catch (error) {
      console.error("Failed to create job ad:", error);
      toast.error("Failed to post job advertisement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser)
    return <div className="text-center p-6">Loading user data...</div>;

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
        📝 Post a Job Advertisement
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className={sectionHeaderStyle}>Job & Company Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelStyle}>Main Category</label>
              <select
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
                required
                className={inputStyle}
              >
                <option value="">Select Main Category</option>
                {allCategories
                  .filter((cat) => cat.key === "Jobs")
                  .map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.so} ({cat.name})
                    </option>
                  ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelStyle}>Job Type (Subcategory)</label>
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value);
                }}
                required
                className={inputStyle}
              >
                <option value="">Select Job Type</option>
                {jobsSubCategoriesFlat.map((job) => (
                  <option key={job.key} value={job.key}>
                    {job.so} ({job.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className={labelStyle}>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Company Name"
              required
              className={inputStyle}
            />
          </div>

          <div className="mt-6">
            <label className={labelStyle}>Cinwaanka Shaqada (Job Title)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tusaale: Injineer Sare oo Web-ka ah (e.g., Senior Web Developer)"
              required
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Candidate Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                required
                className={inputStyle}
              >
                <option value="">Select Experience</option>
                {experienceLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.so} ({level.title})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                required
                className={inputStyle}
              >
                <option value="">Select Education</option>
                {educationLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.so} ({level.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className={labelStyle}>
              Required Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g., HTML, CSS, React, Somali, English"
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Location & Compensation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Region</label>
              <select
                value={region}
                // When region changes, it triggers the useEffect to filter cities
                onChange={(e) => setRegion(e.target.value)}
                required
                className={inputStyle}
              >
                <option value="">Select region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>City</label>
              {/* Updated City selector */}
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                required={!showNewCityInputs}
                className={inputStyle}
                disabled={!region}
              >
                <option value="">
                  {region ? "Select city" : "First select a region"}
                </option>
                {filteredCities.map((c) => (
                  // Assuming filteredCities contains city names (strings)
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                {/* Custom city option */}
                <option value="custom" className="font-bold text-blue-600">
                  Add new city
                </option>
              </select>
            </div>
          </div>

          {/* Conditional inputs for new city */}
          {showNewCityInputs && (
            <div className="grid md:grid-cols-2 gap-6 mt-6 border-t pt-4 border-dashed border-gray-300">
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-2">
                  Enter details for the new city:
                </p>
              </div>
              <div>
                <label className={labelStyle}>New City Name (English)</label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="e.g., New Burao"
                  required
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>
                  New City Name (Somali / So)
                </label>
                <input
                  type="text"
                  value={newCitySo}
                  onChange={(e) => setNewCitySo(e.target.value)}
                  placeholder="e.g., Burco Cusub"
                  className={inputStyle}
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className={labelStyle}>
              Salary Range (e.g., Monthly/Annually)
            </label>
            <input
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g., $500 - $700 per month"
              required
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Job Description</h2>
          <div>
            <label className={labelStyle}>Description & Responsibilities</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail job responsibilities, required skills, and benefits..."
              required
              rows={8}
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Application Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Application Method</label>
              <select
                value={applicationMethod}
                onChange={(e) => setApplicationMethod(e.target.value)}
                required
                className={inputStyle}
              >
                <option value="">Select Method</option>
                {applicationMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.so} ({method.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>
                {applicationMethod === "email"
                  ? "Email Address"
                  : applicationMethod === "url"
                  ? "Application URL"
                  : applicationMethod === "phone"
                  ? "Phone Number"
                  : "Contact Detail"}
              </label>
              <input
                type={
                  applicationMethod === "email"
                    ? "email"
                    : applicationMethod === "url"
                    ? "url"
                    : "text"
                }
                value={applicationContact}
                onChange={(e) => setApplicationContact(e.target.value)}
                placeholder={`Enter required contact: ${applicationMethod}`}
                required
                className={inputStyle}
              />
            </div>
          </div>
          <div className="mt-6">
            <label className={labelStyle}>Application Deadline</label>
            <input
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              required
              className={inputStyle}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className={`w-full py-3 rounded-xl text-white font-bold text-lg tracking-wider transition transform ${
            isFormValid() && !isSubmitting
              ? "bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Posting Job Ad..." : "Post Job Advertisement"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdForJobs;
