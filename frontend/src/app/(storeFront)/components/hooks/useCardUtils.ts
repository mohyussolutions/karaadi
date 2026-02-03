"use client";

export function useCardUtils() {
  const getValidImageUrl = (images: any): string => {
    if (!images) return "/placeholder.png";

    if (Array.isArray(images)) {
      const first = images.find(
        (img) => typeof img === "string" && img.trim() !== "",
      );
      return first || "/placeholder.png";
    }

    if (typeof images === "string" && images.trim() !== "") {
      return images;
    }

    if (typeof images === "object" && images.url) {
      return images.url;
    }

    return "/placeholder.png";
  };

  const formatDescription = (
    description: string | string[] | boolean | null | undefined,
    maxLength = 80,
  ): string => {
    if (!description || typeof description === "boolean") return "";

    const text = Array.isArray(description)
      ? description.join(" ")
      : description;

    if (typeof text !== "string") return "";

    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength).trim() + "...";
  };

  const getHref = (id: string, category: string): string => {
    if (!id) return "#";

    switch (category) {
      case "vehicle":
        return `/vehicles/${id}`;
      case "property":
        return `/properties/${id}`;
      case "job":
        return `/jobs/${id}`;
      default:
        return `/${category}/${id}`;
    }
  };

  return {
    getValidImageUrl,
    formatDescription,
    getHref,
  };
}
