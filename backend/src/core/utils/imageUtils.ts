export function convertImages(item: any, table: string): any {
  if (!item) return item;
  const id = item.id || item._id;
  const images = ((item.images ?? []) as string[])
    .map((img, idx) =>
      img && img.startsWith("data:")
        ? `api/images/${table}/${id}/${idx}`
        : img,
    )
    .filter((img) => img && img.trim() !== "");
  return { ...item, images };
}
