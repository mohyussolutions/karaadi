"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BusinessCourseFormView from "@/app/(storeFront)/components/forms/businnes/BusinessCourseFormView";
import { cities } from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";

const BusinessCourseForm = () => {
  const initialBusinessTypes: any[] = [];

  const [courseTitle, setCourseTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [streetName, setStreetName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [newBusinessType, setNewBusinessType] = useState("");
  const [businessTypes, setBusinessTypes] = useState(initialBusinessTypes);

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
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
    if (region) {
      const citiesInRegion = cities
        .filter((c) => c.regionId === region)
        .map((c) => c.name);

      setFilteredCities(citiesInRegion);
      setCity("");
      setShowNewCityInputs(false);
      setNewCity("");
    } else {
      setFilteredCities([]);
      setCity("");
      setShowNewCityInputs(false);
      setNewCity("");
    }
  }, [region]);

  useEffect(() => {
    if (
      businessType &&
      !businessTypes.find((bt: { title: string }) => bt.title === businessType)
    ) {
      setBusinessTypes((prev) => [...prev, { title: businessType }]);
    }
  }, [businessType, businessTypes]);

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
      setImageError("You can upload up to 10 images only.");
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

    return (
      courseTitle.trim() &&
      companyName.trim() &&
      streetName.trim() &&
      businessType.trim() &&
      region.trim() &&
      selectedCity &&
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
      alert("Please fill all required fields correctly.");
      return;
    }

    const selectedCity = showNewCityInputs ? newCity.trim() : city;

    const message = `
Ready to post Business Course ad:
Title: ${courseTitle}
Company Name: ${companyName}
Street Name: ${streetName}
Business Type: ${businessType}
Region: ${region}
City: ${selectedCity}
Description: ${description}
Price: ${price}
Images Count: ${images.length}
`.trim();

    router.push("/sumary/businessSummary");

    formRef.current?.reset();
    setCourseTitle("");
    setCompanyName("");
    setStreetName("");
    setBusinessType("");
    setRegion("");
    setCity("");
    setDescription("");
    setPrice("");
    setImages([]);
    setImageError(null);
    setFilteredCities([]);
    setNewCity("");
    setShowNewCityInputs(false);
    setBusinessTypes(initialBusinessTypes);
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
