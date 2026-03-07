"use client";

import React from "react";

interface BusinessType {
  title: string;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  courseTitle: string;
  setCourseTitle: React.Dispatch<React.SetStateAction<string>>;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
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
  regions: { id: string; name: string }[];
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  filteredCities: any[];
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
  categories,
  selectedCategory,
  setSelectedCategory,
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
  regions,
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
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100 space-y-6"
    >
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Diiwaangeli Ganacsigaaga
        </h2>
        <p className="text-gray-500 text-sm">
          Fadlan buuxi macluumaadka hoos ku qoran.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Magaca Ganacsiga *</span>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tusaale: Karaadi Electronics"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Qaybta (Category) *</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">-- Dooro Qaybta --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Magaca Shirkadda *</span>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Jidka/Street *</span>
          <input
            type="text"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Gobolka *</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">-- Dooro Gobolka --</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Magaalada *</span>
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
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">-- Dooro Magaalada --</option>
              {filteredCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="custom" className="text-blue-600 font-bold">
                + Ku dar Magaalo Cusub
              </option>
            </select>
          ) : (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Qor magaca magaalada"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewCityInputs(false)}
                className="text-red-500 text-xs hover:underline"
              >
                Ka noqo
              </button>
            </div>
          )}
        </label>
      </div>

      <label className="block">
        <span className="text-gray-700 font-medium">Sharaxaad kooban *</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
          required
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">
          Qiimaha / Budget (USD) *
        </span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </label>

      <div className="space-y-2">
        <span className="text-gray-700 font-medium block">
          Sawirrada Ganacsiga *
        </span>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-blue-600 hover:text-blue-700"
          >
            Riix halkan si aad u soo geliso sawirrada (Ugu badnaan 10)
          </label>
        </div>
        {imageError && <p className="text-red-600 text-xs">{imageError}</p>}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((file, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-20 object-cover rounded-lg border"
                alt="preview"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors transform active:scale-[0.98]"
      >
        Gudbi Codsiga
      </button>
    </form>
  );
};

export default BusinessCourseFormView;
