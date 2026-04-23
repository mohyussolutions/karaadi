"use client";
import React, { useState } from "react";

export default function BusinessProducts() {
  const [activeTab, setActiveTab] = useState("products");

  const navLinks = [
    { id: "products", labelEn: "Products", labelSo: "Alaabaha" },
    {
      id: "advertising",
      labelEn: "Advertising Solutions",
      labelSo: "Xalal Xayaysiis",
    },
    {
      id: "tips",
      labelEn: "Get the most out of Karaadi",
      labelSo: "Ka faa’iidayso Karaadi",
    },
    { id: "business", labelEn: "Create Business", labelSo: "Ganacsi Samee" },
    { id: "companies", labelEn: "Companies", labelSo: "Shirkadaha" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Workstation & Products</h1>
      <p className="mb-4">
        Learn more about our products and get inspired on how to get the most
        out of FINN.no as a business customer.
      </p>
      <nav className="mb-8 flex gap-4 border-b pb-2">
        {navLinks.map((link) => (
          <button
            key={link.id}
            className={`text-blue-600 hover:underline font-medium px-2 py-1 rounded ${activeTab === link.id ? "border-b-2 border-blue-600" : ""}`}
            onClick={() => setActiveTab(link.id)}
          >
            {link.labelEn}
          </button>
        ))}
      </nav>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Advertising Solutions</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>Real Estate – Sale and rental of property</li>
          <li>Jobs – Posting all types of positions</li>
          <li>Motor – Vehicles, boats, and machinery</li>
          <li>Marketplace – Sale of various items</li>
          <li>Personal Finance – Loans and insurance</li>
        </ul>
      </section>
    </div>
  );
}
