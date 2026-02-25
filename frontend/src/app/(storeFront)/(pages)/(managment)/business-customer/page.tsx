"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BusinessCourseFormView from "@/app/(storeFront)/components/forms/businnes/BusinessCourseFormView";
import {
  addCity,
  getAllCities,
  getAllRegions,
} from "@/actions/categories/geoAction";
import allowedData from "./allowedCompanies.json";

const BusinessCourseForm = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [streetName, setStreetName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [newBusinessType, setNewBusinessType] = useState("");
  const [businessTypes, setBusinessTypes] = useState<any[]>([]);

  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [newCity, setNewCity] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showNewBusinessTypeInput, setShowNewBusinessTypeInput] =
    useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchGeoData() {
      try {
        const [regs, cities] = await Promise.all([
          getAllRegions(),
          getAllCities(),
        ]);
        setRegions(regs || []);
        setAllCities(cities || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchGeoData();
  }, []);

  useEffect(() => {
    if (region) {
      setFilteredCities(allCities.filter((c) => c.regionId === region));
    } else {
      setFilteredCities([]);
    }
    setCity("");
  }, [region, allCities]);

  const handleAddNewBusinessType = () => {
    const trimmed = newBusinessType.trim();
    if (!trimmed) return;
    if (
      !businessTypes.find(
        (bt) => bt.title.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setBusinessTypes((prev) => [...prev, { title: trimmed }]);
    }
    setBusinessType(trimmed);
    setShowNewBusinessTypeInput(false);
    setNewBusinessType("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 10) {
      setImageError("Ugu badnaan 10 sawir ayaa la ogol yahay.");
      return;
    }
    setImages(selectedFiles);
    setImageError(null);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    const selectedCity = showNewCityInputs ? newCity.trim() : city;
    const isAllowed = allowedData.companies.some(
      (name) => name.toLowerCase() === companyName.trim().toLowerCase(),
    );

    return (
      courseTitle.trim() &&
      companyName.trim() &&
      isAllowed &&
      streetName.trim() &&
      businessType.trim() &&
      region.trim() &&
      selectedCity &&
      description.trim() &&
      price &&
      !isNaN(Number(price)) &&
      images.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCompanyAllowed = allowedData.companies.some(
      (name) => name.toLowerCase() === companyName.trim().toLowerCase(),
    );

    if (!isCompanyAllowed) {
      alert("Shirkaddan looma ogola inay abuurto koorsooyin.");
      return;
    }

    if (!isFormValid()) {
      alert("Fadlan buuxi bannaannada loo baahan yahay.");
      return;
    }

    try {
      let finalCityName = city;
      if (showNewCityInputs && newCity.trim()) {
        const cityResult = await addCity({
          id: `city-${Date.now()}`,
          name: newCity.trim(),
          regionId: region,
          isActive: true,
        });
        if (cityResult.success) finalCityName = cityResult.data.name;
      }
      router.push("/sumary/businessSummary");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BusinessCourseFormView
      courseTitle={courseTitle}
      setCourseTitle={setCourseTitle}
      companyName={companyName}
      setCompanyName={setCompanyName}
      streetName={streetName}
      setStreetName={setStreetName}
      businessType={businessType}
      setBusinessType={setBusinessType}
      showNewBusinessTypeInput={showNewBusinessTypeInput}
      setShowNewBusinessTypeInput={setShowNewBusinessTypeInput}
      newBusinessType={newBusinessType}
      setNewBusinessType={setNewBusinessType}
      businessTypes={businessTypes}
      region={region}
      setRegion={setRegion}
      city={city}
      setCity={setCity}
      filteredCities={filteredCities}
      newCity={newCity}
      setNewCity={setNewCity}
      showNewCityInputs={showNewCityInputs}
      setShowNewCityInputs={setShowNewCityInputs}
      description={description}
      setDescription={setDescription}
      price={price}
      setPrice={setPrice}
      images={images}
      setImages={setImages}
      imageError={imageError}
      handleAddNewBusinessType={handleAddNewBusinessType}
      handleImageChange={handleImageChange}
      handleRemoveImage={handleRemoveImage}
      handleSubmit={handleSubmit}
      formRef={formRef}
    />
  );
};

export default BusinessCourseForm;
