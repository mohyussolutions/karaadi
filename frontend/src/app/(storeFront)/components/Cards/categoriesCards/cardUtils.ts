export const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US").format(numPrice || 0);
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getValidImageUrl = (url: string | undefined): string | null => {
  if (!url || url.trim() === "") return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("/")) {
    return url;
  }
  return `${API_BASE}/${url}`;
};
