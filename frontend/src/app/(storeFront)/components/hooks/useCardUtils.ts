"use client";

export function useCardUtils() {
  const getValidImageUrl = (images: any): string => {
    if (!images) return "/placeholder.png";

    if (Array.isArray(images)) {
      for (const img of images) {
        if (typeof img === "string" && img.trim() !== "") return img;
        if (img && typeof img === "object") {
          if (typeof img.url === "string" && img.url.trim() !== "")
            return img.url;
          if (typeof img.src === "string" && img.src.trim() !== "")
            return img.src;
        }
      }
      return "/placeholder.png";
    }

    if (typeof images === "string" && images.trim() !== "") {
      return images;
    }

    if (typeof images === "object" && images !== null) {
      if (
        typeof (images as any).url === "string" &&
        (images as any).url.trim() !== ""
      )
        return (images as any).url;
      if (
        typeof (images as any).src === "string" &&
        (images as any).src.trim() !== ""
      )
        return (images as any).src;
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

    const cat = String(category || "").toLowerCase();

    const vehicleMatch =
      /^(car|cars|boat|boats|motorcycle|motorcycles|bike|bikes|motor|vehicle|vehicles|farmequipment)$/i;
    if (vehicleMatch.test(cat)) return `/vehicles/${id}`;

    const propertyMatch =
      /^(property|properties|real[-_ ]?estate|realestate)$/i;
    if (propertyMatch.test(cat)) return `/real-estate/${id}`;

    const jobMatch = /^(job|jobs|jib|jibs)$/i;
    if (jobMatch.test(cat)) return `/jobs/${id}`;

    const cleaned = cat.replace(/^\/+|\/+$/g, "") || "items";
    return `/${cleaned}/${id}`;
  };

  return {
    getValidImageUrl,
    formatDescription,
    getHref,
  };
}
