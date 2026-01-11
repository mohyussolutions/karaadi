"use client";

import React from "react";
import ManagementCard from "./components/ManagementCard";
import FeaturedCard from "./components/FeaturedCard";
import {
  managementSections,
  otherSections,
} from "@/app/(links)/common/managementLinks";

const ManagementContent = () => {
  const allSections = [...managementSections, ...otherSections];

  const categories = {
    listings: managementSections,
    content: otherSections.filter((s) => s.category === "content"),
    operations: otherSections.filter((s) => s.category === "operations"),
    analytics: otherSections.filter((s) => s.category === "analytics"),
  };

  const featuredSections = allSections.filter((s) => s.featured).slice(0, 6);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Management Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage platform content, users, and operations
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Management Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredSections.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Listings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managementSections.map((item) => (
            <ManagementCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {Object.entries(categories).map(
        ([category, sections]) =>
          sections.length > 0 &&
          category !== "listings" && (
            <div key={category} className="mb-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((item) => (
                  <ManagementCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default ManagementContent;
