"use client";

import React from "react";
import { useEffect, useState } from "react";
import { getAllRegions } from "@/actions/categories/geoAction";

interface BusinessType {
  title: string;
}

interface Props {
  courseTitle: string;
  setCourseTitle: React.Dispatch<React.SetStateAction<string>>;
  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  streetName: string;
  setStreetName: React.Dispatch<React.SetStateAction<string>>;
  businessType: string;
  setBusinessType: React.Dispatch<React.SetStateAction<string>>;
  showNewBusinessTypeInput: boolean;
  setShowNewBusinessTypeInput: React.Dispatch<React.SetStateAction<boolean>>;
  newBusinessType: string;
  setNewBusinessType: React.Dispatch<React.SetStateAction<string>>;
  businessTypes: BusinessType[];
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  filteredCities: string[];
  newCity: string;
  setNewCity: React.Dispatch<React.SetStateAction<string>>;
  showNewCityInputs: boolean;
  setShowNewCityInputs: React.Dispatch<React.SetStateAction<boolean>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  imageError: string | null;
  handleAddNewBusinessType: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
}

const BusinessCourseFormView: React.FC<Props> = ({
  courseTitle,
  setCourseTitle,
  companyName,
  setCompanyName,
  streetName,
  setStreetName,
  businessType,
  setBusinessType,
  showNewBusinessTypeInput,
  setShowNewBusinessTypeInput,
  newBusinessType,
  setNewBusinessType,
  businessTypes,
  region,
  setRegion,
  city,
  setCity,
  filteredCities,
  newCity,
  setNewCity,
  showNewCityInputs,
  setShowNewCityInputs,
  description,
  setDescription,
  price,
  setPrice,
  images,
  imageError,
  handleAddNewBusinessType,
  handleImageChange,
  handleRemoveImage,
  handleSubmit,
  formRef,
}) => {
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    getAllRegions().then((data) => setRegions(data || []));
  }, []);
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-6">Business Course Form</h2>

      <label className="block mb-4">
        Title *
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </label>

      <label className="block mb-4">
        Company Name *
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </label>

      <label className="block mb-4">
        Street Name *
        <input
          type="text"
          value={streetName}
          onChange={(e) => setStreetName(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </label>

      {!showNewBusinessTypeInput ? (
        <label className="block mb-4">
          Business Type *
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          >
            <option value="">-- Select Business Type --</option>
            {businessTypes.map((bt) => (
              <option key={bt.title} value={bt.title}>
                {bt.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setShowNewBusinessTypeInput(true);
              setBusinessType("");
            }}
            className="mt-2 text-blue-600 underline"
          >
            + Add new business type
          </button>
        </label>
      ) : (
        <label className="block mb-4">
          New Business Type *
          <input
            type="text"
            value={newBusinessType}
            onChange={(e) => setNewBusinessType(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleAddNewBusinessType}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewBusinessTypeInput(false);
                setNewBusinessType("");
              }}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </label>
      )}

      <label className="block mb-4">
        Region *
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        >
          <option value="">-- Select Region --</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-4">
        City *
        {!showNewCityInputs ? (
          <select
            value={city}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setShowNewCityInputs(true);
                setCity("");
              } else {
                setCity(e.target.value);
              }
            }}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          >
            <option value="">-- Select City --</option>
            {filteredCities.map((c, idx) => {
              if (typeof c === "object" && c !== null && c.id) {
                return (
                  <option key={c.id} value={c.id}>
                    {c.name || c.id}
                  </option>
                );
              }
              return (
                <option key={c + idx} value={c}>
                  {c}
                </option>
              );
            })}
            <option value="custom">+ Add new city</option>
          </select>
        ) : (
          <input
            type="text"
            placeholder="New city name"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        )}
      </label>

      <label className="block mb-4">
        Description *
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          rows={4}
          required
        />
      </label>

      <label className="block mb-4">
        Price (USD) *
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </label>

      <label className="block mb-4">
        Images *
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        {imageError && (
          <p className="text-red-600 text-sm mt-2">{imageError}</p>
        )}
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {images.map((file, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-700 text-white w-full py-3 rounded font-semibold"
      >
        Submit
      </button>
    </form>
  );
};

export default BusinessCourseFormView;
