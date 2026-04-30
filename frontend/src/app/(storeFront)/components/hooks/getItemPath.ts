export function getItemPath(mainCategory: string, id: string): string {
  if (!id) return "/";
  switch (mainCategory) {
    case "Gawaari":
      return `/vehicles/cars/${id}`;
    case "Boats":
      return `/vehicles/boats/${id}`;
    case "Motorcycle":
      return `/vehicles/motorcycles/${id}`;
    case "Equipment":
      return `/vehicles/Farmequipment/${id}`;
    case "RealEstate":
      return `/real-estate/${id}`;
    case "Marketplace":
      return `/item-details/${id}`;
    case "Jobs":
      return `/jobs/${id}`;
    default:
      return `/vehicles/${id}`;
  }
}
