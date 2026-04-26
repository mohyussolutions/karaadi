export function getItemPath(mainCategory: string, id: string): string {
  if (!id) return "/";
  switch (mainCategory) {
    case "Real Estate":
      return `/real-estate/${id}`;
    case "Marketplace":
      return `/item-details/${id}`;
    case "Jobs":
      return `/jobs/${id}`;
    default:
      return `/vehicles/${id}`;
  }
}
