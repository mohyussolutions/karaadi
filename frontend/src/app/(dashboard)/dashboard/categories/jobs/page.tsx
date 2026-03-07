"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Plus, Briefcase, Loader2, Filter, X } from "lucide-react";
import {
  createJob,
  deleteJob,
  fetchJobs,
  Job,
} from "@/actions/categories/jobActions";
import { verifySession } from "@/actions/core/authAction";

const JobsDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    city: "",
    region: "",
    employmentType: "Full-time",
    isPaid: true,
  });

  useEffect(() => {
    const init = async () => {
      const session = await verifySession();
      if (session?.accessToken) {
        setAuthenticated(true);
        setIsAdmin(session.isAdmin || session.isManager || false);
      }
      await loadJobs();
    };
    init();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const data = await fetchJobs();
    setJobs(data);
    setLoading(false);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticated || !isAdmin) {
      alert("You don't have permission to create jobs");
      return;
    }

    setIsSubmitting(true);
    const result = await createJob(formData);

    if (result.success) {
      await loadJobs();
      setFormData({
        title: "",
        company: "",
        city: "",
        region: "",
        employmentType: "Full-time",
        isPaid: true,
      });
    } else {
      alert(result.error || "Failed to create job");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!authenticated || !isAdmin) {
      alert("You don't have permission to delete jobs");
      return;
    }
    if (!confirm("Are you sure you want to delete this job?")) return;

    const originalJobs = [...jobs];
    setJobs((prev) => prev.filter((job) => job.id !== id));

    const result = await deleteJob(id);
    if (!result.success) {
      setJobs(originalJobs);
      alert(result.error || "Failed to delete job");
    }
  };

  if (!authenticated && !loading) {
    return (
      <div className="w-screen min-h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please log in to access the jobs dashboard.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (authenticated && !isAdmin && !loading) {
    return (
      <div className="w-screen min-h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You need admin or manager privileges to access this page.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-8">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-7 lg:mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <span className="truncate">Job Management</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Create, manage, and remove job listings
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              )}
              <span className="bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm whitespace-nowrap">
                {jobs.length} Active
              </span>
            </div>
          </div>

          {/* Create Job Form Section */}
          <section className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 mb-5 sm:mb-6 md:mb-7 lg:mb-8">
            <h2 className="text-xs sm:text-sm font-semibold uppercase text-gray-400 mb-3 sm:mb-4 tracking-wider">
              Add New Listing
            </h2>
            <form
              onSubmit={handleCreateJob}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            >
              <input
                className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                placeholder="Job Title *"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <input
                className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                placeholder="Company Name *"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
              <select
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData({ ...formData, employmentType: e.target.value })
                }
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
              <input
                className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                placeholder="City *"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
              <input
                className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                placeholder="Region *"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white rounded-lg p-2.5 hover:bg-blue-700 disabled:bg-blue-300 transition flex items-center justify-center gap-2 font-medium shadow-md shadow-blue-100 text-sm sm:col-span-1 lg:col-span-1 xl:col-span-1"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Post Job
              </button>
            </form>
          </section>

          {/* Jobs List Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-600 text-sm w-[40%]">
                      Job Information
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm w-[20%]">
                      Type
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm w-[25%]">
                      Location
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-sm w-[15%] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="font-bold text-gray-800">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.company || "Direct Hire"}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                            {job.employmentType}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {job.city}, {job.region}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                          <Briefcase className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No jobs currently listed.
                        </p>
                        <p className="text-sm text-gray-400">
                          Use the form above to post your first job.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {jobs.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-bold text-gray-800 truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {job.company || "Direct Hire"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                          {job.employmentType}
                        </span>
                        <span className="text-xs text-gray-500">
                          {job.city}, {job.region}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <Briefcase className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No jobs currently listed.
                  </p>
                  <p className="text-sm text-gray-400">
                    Use the form above to post your first job.
                  </p>
                </div>
              )}
            </div>
          </div>

          {jobs.length > 0 && (
            <div className="mt-4 text-xs text-gray-400 text-right">
              Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsDashboard;
