import React from "react";

const navLinks = [
  { id: "products", labelEn: "Products" },
  { id: "advertising", labelEn: "Advertising Solutions" },
  { id: "tips", labelEn: "Get the most out of FINN" },
  { id: "business", labelEn: "Create Business" },
  { id: "companies", labelEn: "Companies" },
];

export default function BusinessProducts() {
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
            className="text-blue-600 hover:underline font-medium px-2 py-1 rounded"
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
      <section>
        <h2 className="text-xl font-semibold mb-2">Get the most out of FINN</h2>
        <p>
          Contact us for advice on how to maximize your results as a business
          customer.
        </p>
      </section>
    </div>
  );
}
