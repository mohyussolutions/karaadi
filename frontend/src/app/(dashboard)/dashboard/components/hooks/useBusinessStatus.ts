export function useBusinessStatus() {
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
      suspended: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || colors.inactive;
  };

  const getStatusText = (status: string): { so: string; en: string } => {
    const texts: Record<string, { so: string; en: string }> = {
      pending: { so: "Sugitaanka", en: "Pending" },
      active: { so: "Firfircoon", en: "Active" },
      inactive: { so: "Aan firfircoon", en: "Inactive" },
      suspended: { so: "Xanniday", en: "Suspended" },
    };
    return texts[status] || { so: "Aan la aqoon", en: "Unknown" };
  };

  const isActive = (status: string): boolean => status === "active";
  const isPending = (status: string): boolean => status === "pending";
  const isSuspended = (status: string): boolean => status === "suspended";
  const isInactive = (status: string): boolean => status === "inactive";

  return {
    getStatusColor,
    getStatusText,
    isActive,
    isPending,
    isSuspended,
    isInactive,
  };
}
