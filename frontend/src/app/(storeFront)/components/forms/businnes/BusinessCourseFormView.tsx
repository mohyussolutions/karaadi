"use client";

import React from "react";
import { regions } from "../../shared/SomaliMapRegionsAndCities/SomaliaRegions";

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
  district: string;
  setDistrict: React.Dispatch<React.SetStateAction<string>>;
  filteredCities: string[];
  filteredDistricts: string[];
  newCity: string;
  setNewCity: React.Dispatch<React.SetStateAction<string>>;
  newDistrict: string;
  setNewDistrict: React.Dispatch<React.SetStateAction<string>>;
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
  handleSaveNewCityDistrict: () => void;
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
  district,
  setDistrict,
  filteredCities,
  filteredDistricts,
  newCity,
  setNewCity,
  newDistrict,
  setNewDistrict,
  showNewCityInputs,
  setShowNewCityInputs,
  description,
  setDescription,
  price,
  setPrice,
  images,
  setImages,
  imageError,
  handleAddNewBusinessType,
  handleSaveNewCityDistrict,
  handleImageChange,
  handleRemoveImage,
  handleSubmit,
  formRef,
}) => {
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
          placeholder="sale or rend (iska gad ama kiro)"
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
          placeholder="the componay name (magaca shirkada)"
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
          placeholder="the componay name (magaca shirkada)"
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
              Save Business Type
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewBusinessTypeInput(false);
                setNewBusinessType("");
              }}
              className="px-4 py-2 rounded border"
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
            {filteredCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
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
        District *
        {!showNewCityInputs ? (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          >
            <option value="">-- Select District --</option>
            {filteredDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="New district name"
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        )}
      </label>

      {showNewCityInputs && (
        <div className="mb-4 flex gap-4">
          <button
            type="button"
            onClick={handleSaveNewCityDistrict}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save New City & District
          </button>
          <button
            type="button"
            onClick={() => {
              setShowNewCityInputs(false);
              setNewCity("");
              setNewDistrict("");
            }}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      )}

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
          step="0.01"
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
          className="w-full mt-1"
          required={images.length === 0}
        />
        {imageError && (
          <p className="text-red-600 mt-2 text-sm">{imageError}</p>
        )}
      </label>

      {images.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.map((file, idx) => (
            <div key={idx} className="relative border rounded overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx + 1}`}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="mt-6 bg-blue-700 text-white px-6 py-3 rounded font-semibold w-full"
      >
        Submit
      </button>
    </form>
  );
};

export default BusinessCourseFormView;
