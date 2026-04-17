export const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US").format(numPrice || 0);
};

export const getValidImageUrl = (url: string | undefined): string | null => {
  if (!url || url.trim() === "") return null;
  return url;
};
