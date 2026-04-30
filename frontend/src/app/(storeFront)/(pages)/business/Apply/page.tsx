"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { IoBusiness } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import {
  createBusiness,
  getMyBusinesses,
} from "@/actions/categories/businessActions";
import BusinessStepper from "../steps/BusinessStepper";

type FormState = {
  companyName: string;
  orgNumber: string;
  businessEmail: string;
  phone: string;
  contactPerson: string;
  website: string;
  address: string;
  description: string;
  categories: string[];
};

export default function ApplyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    companyName: "",
    orgNumber: "",
    businessEmail: "",
    phone: "",
    contactPerson: "",
    website: "",
    address: "",
    description: "",
    categories: [],
  });

  const availableCategories = [
    { value: "realestate", label: t("mine.businesses.categories.realestate", "Real Estate") },
    { value: "schools", label: t("mine.businesses.categories.schools", "Schools") },
    { value: "motor", label: t("mine.businesses.categories.motor", "Motor") },
    { value: "marketplace", label: t("mine.businesses.categories.marketplace", "Marketplace") },
  ];

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getMyBusinesses().then((data: any) => {
      const businesses = data?.businesses ?? [];
      if (businesses.length > 0) {
        const biz = businesses[0];
        if (biz.status === "pending" || !biz.isVerified) {
          router.replace(`/business/Approval?businessId=${biz.id}`);
        } else if (biz.status === "active" && !biz.planId) {
          router.replace(`/business/plan?businessId=${biz.id}`);
        } else if (biz.status === "active" && biz.planId) {
          router.replace(`/business/post?businessId=${biz.id}`);
        } else {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    });
  }, [user, authLoading]);

  const set = (k: keyof FormState, v: string | string[]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const canSubmit =
    form.companyName.trim() &&
    form.businessEmail.trim() &&
    form.phone.trim() &&
    form.categories.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !user) return;
    setSubmitting(true);

    const payload = {
      name: form.companyName.trim(),
      email: form.businessEmail.trim(),
      phone: form.phone.trim(),
      orgNumber: form.orgNumber.trim() || undefined,
      contactName: form.contactPerson.trim() || undefined,
      website: form.website.trim() || undefined,
      address: form.address.trim() || undefined,
      description: form.description.trim() || undefined,
      categories: form.categories,
    };

    console.log("Submitting payload:", payload);

    try {
      const res = (await createBusiness(payload)) as any;

      console.log("Response:", res);

      if (res?.success && res?.business?.id) {
        toast.success(
          t("mine.businesses.applySuccess", "Application submitted!"),
        );
        router.push(`/business/Approval?businessId=${res.business.id}`);
      } else {
        const errorMessage = res?.error || "Submission failed.";
        toast.error(errorMessage);
        console.error("Submission error:", errorMessage);
      }
    } catch (error) {
      console.error("Caught error:", error);
      toast.error(t("mine.businesses.genericError", "Something went wrong."));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || checking) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
          <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-56" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded-2xl" />
        <div className="h-96 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
          <IoBusiness className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("mine.businesses.applyTitle", "Register Business")}
          </h1>
          <p className="text-sm text-gray-500">
            {t(
              "mine.businesses.applySubtitle",
              "Fill in your business details",
            )}
          </p>
        </div>
      </div>

      <BusinessStepper active={1} />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5">
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("mine.businesses.selectCategories", "Where do you want to advertise?") + " *"}
          </label>
          <div className="flex flex-wrap gap-3">
            {availableCategories.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat.value}
                  checked={form.categories.includes(cat.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({
                      ...prev,
                      categories: checked
                        ? [...prev.categories, cat.value]
                        : prev.categories.filter((c) => c !== cat.value),
                    }));
                  }}
                  className="accent-blue-600"
                />
                <span>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {t("mine.businesses.businessInfo", "Business Information")}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label={t("mine.businesses.companyName", "Company Name") + " *"}
            value={form.companyName}
            onChange={(v) => set("companyName", v)}
            required
            placeholder={t(
              "mine.businesses.companyNamePlaceholder",
              "e.g. Green Valley Trading",
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={
                t("mine.businesses.businessEmail", "Business Email") + " *"
              }
              value={form.businessEmail}
              onChange={(v) => set("businessEmail", v)}
              type="email"
              required
              placeholder="info@company.com"
            />
            <Field
              label={t("mine.businesses.phone", "Phone") + " *"}
              value={form.phone}
              onChange={(v) => set("phone", v)}
              type="tel"
              required
              placeholder="+252 61 234 5678"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={t("mine.businesses.orgNumber", "Org. Number")}
              value={form.orgNumber}
              onChange={(v) => set("orgNumber", v)}
              placeholder={t("mine.businesses.optional", "Optional")}
            />
            <Field
              label={t("mine.businesses.contactPerson", "Contact Person")}
              value={form.contactPerson}
              onChange={(v) => set("contactPerson", v)}
              placeholder={t("mine.businesses.optional", "Optional")}
            />
          </div>

          <Field
            label={t("mine.businesses.address", "Address")}
            value={form.address}
            onChange={(v) => set("address", v)}
            placeholder={t("mine.businesses.optional", "Optional")}
          />

          <Field
            label={t("mine.businesses.website", "Website")}
            value={form.website}
            onChange={(v) => set("website", v)}
            type="url"
            placeholder="https:// (optional)"
          />

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">
              {t("mine.businesses.description", "Description")}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder={t(
                "mine.businesses.descriptionPlaceholder",
                "Brief description of your business…",
              )}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold text-base disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-sm"
          >
            {submitting ? (
              t("mine.businesses.submitting", "Submitting…")
            ) : (
              <>
                {t("mine.businesses.submitApplication", "Submit Application")}
                <FaChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
    </div>
  );
}
