"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import {
  cities,
  Districts,
} from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/SomaliaRegions";
import BusinessCourseFormView from "@/app/(storeFront)/components/forms/businnes/BusinessCourseFormView";

const BusinessCourseForm = () => {
  const nitialBusinessTypes: any[] | (() => any[]) = [];
  const [courseTitle, setCourseTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [streetName, setStreetName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [newBusinessType, setNewBusinessType] = useState("");
  const [businessTypes, setBusinessTypes] = useState(nitialBusinessTypes);
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [showNewBusinessTypeInput, setShowNewBusinessTypeInput] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    if (region) {
      const citiesInRegion = cities
        .filter((c) => c.regionId === region)
        .map((c) => c.name);
      setFilteredCities(citiesInRegion);
      setCity("");
      setDistrict("");
      setFilteredDistricts([]);
      setShowNewCityInputs(false);
      setNewCity("");
      setNewDistrict("");
    } else {
      setFilteredCities([]);
      setCity("");
      setDistrict("");
      setFilteredDistricts([]);
      setShowNewCityInputs(false);
      setNewCity("");
      setNewDistrict("");
    }
  }, [region]);

  useEffect(() => {
    if (city === "custom") {
      setShowNewCityInputs(true);
      setFilteredDistricts([]);
      setDistrict("");
      setNewDistrict("");
    } else if (city) {
      setShowNewCityInputs(false);
      const cityDistrictObj = Districts.find((d) => d.name === city);
      if (cityDistrictObj?.subDistricts) {
        const districtsInCity = cityDistrictObj.subDistricts.map(
          (sd) => sd.name
        );
        setFilteredDistricts(districtsInCity);
      } else {
        setFilteredDistricts([]);
      }
      setDistrict("");
      setNewDistrict("");
    } else {
      setShowNewCityInputs(false);
      setFilteredDistricts([]);
      setDistrict("");
      setNewDistrict("");
    }
  }, [city]);

  useEffect(() => {
    if (
      businessType &&
      !businessTypes.find((bt: { title: string }) => bt.title === businessType)
    ) {
      setBusinessTypes((prev) => [...prev, { title: businessType }]);
    }
  }, [businessType, businessTypes]);

  const handleAddNewBusinessType = () => {
    const trimmedNewType = newBusinessType.trim();
    if (!trimmedNewType) return;
    if (
      !businessTypes.find(
        (bt) => bt.title.toLowerCase() === trimmedNewType.toLowerCase()
      )
    ) {
      setBusinessTypes((prev) => [...prev, { title: trimmedNewType }]);
    }
    setBusinessType(trimmedNewType);
    setShowNewBusinessTypeInput(false);
    setNewBusinessType("");
  };

  const handleSaveNewCityDistrict = () => {
    if (!newCity.trim() || !newDistrict.trim()) {
      alert("Please enter both city and district names.");
      return;
    }
    setCity(newCity.trim());
    setDistrict(newDistrict.trim());
    setShowNewCityInputs(false);
    setFilteredDistricts([newDistrict.trim()]);
    setNewCity("");
    setNewDistrict("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 10) {
      setImageError("You can upload up to 10 images only.");
      return;
    }

    setImages(selectedFiles);
    setImageError(null);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    const selectedCity = showNewCityInputs ? newCity.trim() : city;
    const selectedDistrict = showNewCityInputs ? newDistrict.trim() : district;

    return (
      courseTitle.trim() &&
      companyName.trim() &&
      streetName.trim() &&
      businessType.trim() &&
      region.trim() &&
      selectedCity &&
      selectedDistrict &&
      description.trim() &&
      price &&
      !isNaN(Number(price)) &&
      Number(price) >= 0 &&
      images.length > 0 &&
      images.length <= 10 &&
      !imageError
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert(
        "Please fill out all required fields correctly and upload up to 10 images."
      );
      return;
    }

    const selectedCity = showNewCityInputs ? newCity.trim() : city;
    const selectedDistrict = showNewCityInputs ? newDistrict.trim() : district;

    const message = `
Ready to post Business Course ad:
Title: ${courseTitle}
Company Name: ${companyName}
Street Name: ${streetName}
Business Type: ${businessType}
Region: ${region}
City: ${selectedCity}
District: ${selectedDistrict}
Description: ${description}
Price: ${price}
Images Count: ${images.length}
`.trim();

    localStorage.setItem("businessSummaryMessage", message);
    router.push("/sumary/businessSummary");

    formRef.current?.reset();
    setCourseTitle("");
    setCompanyName("");
    setStreetName("");
    setBusinessType("");
    setRegion("");
    setCity("");
    setDistrict("");
    setDescription("");
    setPrice("");
    setImages([]);
    setImageError(null);
    setFilteredCities([]);
    setFilteredDistricts([]);
    setNewCity("");
    setNewDistrict("");
    setShowNewCityInputs(false);
    setBusinessTypes(nitialBusinessTypes);
    setShowNewBusinessTypeInput(false);
    setNewBusinessType("");
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
      district={district}
      setDistrict={setDistrict}
      filteredCities={filteredCities}
      filteredDistricts={filteredDistricts}
      newCity={newCity}
      setNewCity={setNewCity}
      newDistrict={newDistrict}
      setNewDistrict={setNewDistrict}
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
      handleSaveNewCityDistrict={handleSaveNewCityDistrict}
      handleImageChange={handleImageChange}
      handleRemoveImage={handleRemoveImage}
      handleSubmit={handleSubmit}
      formRef={formRef}
    />
  );
};

export default BusinessCourseForm;
