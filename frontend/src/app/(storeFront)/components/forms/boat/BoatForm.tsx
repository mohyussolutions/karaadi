import React from "react";
import { subCategoriesBoats } from "@/components/navbar/(subLinksCategories)/subCategoriesBoat";
import { regions } from "@/components/shared/SomaliaRegions";

interface BoatFormFieldsProps {
  category: string;
  subCategory: string;
  title: string;
  type: string;
  model: string;
  transmission: string;
  color: string;
  region: string;
  city: string;
  district: string;
  area: string;
  description: string;
  price: string;
  filteredCities?: string[];
  filteredDistricts?: string[];
  showNewCityInputs: boolean;
  newCity: string;
  newDistrict: string;
  images: File[];
  onChange: (field: string, value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSaveNewCityDistrict: () => void;
}

interface SubCategoryOption {
  title: string;
  label: string;
}

interface RegionItem {
  id: string;
  name: string;
}

const BoatFormFields: React.FC<BoatFormFieldsProps> = ({
  category,
  subCategory,
  title,
  type,
  model,
  transmission,
  color,
  region,
  city,
  district,
  area,
  description,
  price,
  filteredCities = [],
  filteredDistricts = [],
  showNewCityInputs,
  newCity,
  newDistrict,
  images,
  onChange,
  onImageChange,
  onRemoveImage,
  onSaveNewCityDistrict,
}) => {
  return (
    <>
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => onChange("category", e.target.value)}
          className="w-full border px-3 py-2"
        >
          <option value="">Select category</option>
          {Object.entries(subCategoriesBoats).map(([key]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      {category && subCategoriesBoats[category] && (
        <div>
          <label className="block mb-1 font-medium">Subcategory</label>
          <select
            value={subCategory}
            onChange={(e) => onChange("subCategory", e.target.value)}
            className="w-full border px-3 py-2"
          >
            <option value="">Select subcategory</option>
            {subCategoriesBoats[category].map((sub: SubCategoryOption) => (
              <option key={sub.title} value={sub.title}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Type</label>
        <input
          type="text"
          value={type}
          onChange={(e) => onChange("type", e.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Model</label>
        <input
          type="text"
          value={model}
          onChange={(e) => onChange("model", e.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Transmission</label>
        <select
          value={transmission}
          onChange={(e) => onChange("transmission", e.target.value)}
          className="w-full border px-3 py-2"
        >
          <option value="">Select transmission</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Color</label>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange("color", e.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Region</label>
        <select
          value={region}
          onChange={(e) => onChange("region", e.target.value)}
          className="w-full border px-3 py-2"
        >
          <option value="">Select region</option>
          {regions.map((reg: RegionItem) => (
            <option key={reg.id} value={reg.id}>
              {reg.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">City</label>
        <select
          value={city}
          onChange={(e) => onChange("city", e.target.value)}
          disabled={!region}
          className="w-full border px-3 py-2"
        >
          <option value="">Select city</option>
          {filteredCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="custom">Other</option>
        </select>
      </div>

      {showNewCityInputs && (
        <div>
          <input
            type="text"
            placeholder="New City"
            value={newCity}
            onChange={(e) => onChange("newCity", e.target.value)}
            className="border px-3 py-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="New District"
            value={newDistrict}
            onChange={(e) => onChange("newDistrict", e.target.value)}
            className="border px-3 py-2 mb-2 w-full"
          />
          <button
            type="button"
            onClick={onSaveNewCityDistrict}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">District</label>
        <select
          value={district}
          onChange={(e) => onChange("district", e.target.value)}
          className="w-full border px-3 py-2"
        >
          <option value="">Select district</option>
          {filteredDistricts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => onChange("price", e.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Images (max 10)</label>
        <input type="file" multiple onChange={onImageChange} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <span
                className="absolute top-0 right-0 bg-red-500 text-white px-1 cursor-pointer"
                onClick={() => onRemoveImage(index)}
              >
                X
              </span>
              <img
                src={URL.createObjectURL(img)}
                alt=""
                className="w-16 h-16 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BoatFormFields;
