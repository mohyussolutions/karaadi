type ImageItem = {
  id?: string;
  _id?: string;
  images?: unknown[];
  [key: string]: unknown;
};

export function convertImages(item: ImageItem, table: string): ImageItem {
  if (!item) return item;
  const id = item.id ?? item._id;
  const images = ((item.images ?? []) as string[])
    .map((img, idx) =>
      img && img.startsWith("data:") ? `api/images/${table}/${id}/${idx}` : img,
    )
    .filter((img) => img && img.trim() !== "");
  return { ...item, images };
}
