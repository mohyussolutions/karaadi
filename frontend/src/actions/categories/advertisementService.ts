import { ADVERTISEMENT_ENDPOINTS } from "../constant/constant";

export interface Advertisement {
  createdAt: string | number | Date;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  isActive: boolean;
  position: string;
  priority: number;
  clicks: number;
  views: number;
  startDate?: Date;
  endDate?: Date;
}

export const getAdvertisements = async (
  position?: string,
  limit?: number,
): Promise<Advertisement[]> => {
  const url = new URL(ADVERTISEMENT_ENDPOINTS.GET_ALL);
  if (position) url.searchParams.append("position", position);
  if (limit) url.searchParams.append("limit", limit.toString());

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch advertisements");
  return response.json();
};

export const getAdvertisementById = async (
  id: string,
): Promise<Advertisement> => {
  const response = await fetch(ADVERTISEMENT_ENDPOINTS.GET_BY_ID(id));
  if (!response.ok) throw new Error("Failed to fetch advertisement");
  return response.json();
};

export const trackAdClick = async (adId: string): Promise<void> => {
  try {
    await fetch(ADVERTISEMENT_ENDPOINTS.CLICK(adId), {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to track ad click:", error);
  }
};

export const createAdvertisement = async (
  data: Partial<Advertisement>,
): Promise<Advertisement> => {
  const response = await fetch(ADVERTISEMENT_ENDPOINTS.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create advertisement");
  return response.json();
};

export const updateAdvertisement = async (
  id: string,
  data: Partial<Advertisement>,
): Promise<Advertisement> => {
  const response = await fetch(ADVERTISEMENT_ENDPOINTS.UPDATE(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update advertisement");
  return response.json();
};

export const deleteAdvertisement = async (id: string): Promise<boolean> => {
  const response = await fetch(ADVERTISEMENT_ENDPOINTS.DELETE(id), {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete advertisement");
  return true;
};

export const getAdStats = async (): Promise<any> => {
  const response = await fetch(ADVERTISEMENT_ENDPOINTS.STATS);
  if (!response.ok) throw new Error("Failed to fetch ad statistics");
  return response.json();
};
