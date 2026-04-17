"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProfileSection } from "./ProfileSection";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { PhoneSection } from "./SecuritySection";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const route = useRouter();
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    if (!user && !loading) {
      route.replace("/login");
    }
  }, [user, loading, route]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const sections = [
    { id: "profile", label: "Profile" },
    { id: "phone", label: "Phone" },
    { id: "delete", label: "Delete Account" },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeSection === section.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {section.label}
              {activeSection === section.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeSection === "profile" && <ProfileSection user={user} />}
          {activeSection === "phone" && <PhoneSection user={user} />}
          {activeSection === "delete" && <DeleteAccountSection user={user} />}
        </div>
      </div>
    </div>
  );
}
