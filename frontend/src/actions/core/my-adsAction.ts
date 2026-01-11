import { apiUrlsForAds } from "../constant/constant";

export const getMyAds = async (accessToken?: string) => {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(apiUrlsForAds.MY_ADS, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (res.status === 401) throw new Error("Unauthorized. Please login again.");
  if (!res.ok) throw new Error("Failed to fetch ads");

  const data = await res.json();
  return data.map((ad: any) => ({
    ...ad,
    id: ad.id || ad._id,
    type: ad.type || "marketplace",
    image: ad.images?.[0] || ad.image,
  }));
};

export const updateAd = async (id: string, data: Record<string, any>) => {
  const payload = {
    title: data.title,
    description: data.description,
    price: data.price,
    maGaday: data.maGaday,
    type: data.type,
  };

  const res = await fetch(`${apiUrlsForAds.UPDATEAds}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result?.message || "Failed to update ad");
  return result;
};
export const deleteAd = async (id: string) => {
  try {
    const res = await fetch(`${apiUrlsForAds.DELETEAds}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
};

export async function payToRelist(adId: string) {
  try {
    const response = await fetch(`/api/ads/${adId}/pay-to-relist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return response.ok;
  } catch {
    return false;
  }
}
