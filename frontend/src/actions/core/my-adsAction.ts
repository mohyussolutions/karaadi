import { apiUrlsForAds } from "../constant/constant";

export const getMyAds = async (accessToken?: string) => {
  const headers: any = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(apiUrlsForAds.MY_ADS, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (res.status === 401) throw new Error("Unauthorized. Please login again.");
  if (!res.ok) throw new Error("Failed to fetch ads");

  const data = await res.json();
  return data.map((ad: any) => ({
    id: ad.id || ad._id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    maGaday: ad.maGaday,
    isPaid: ad.isPaid,
    image: ad.images?.[0] || ad.image,
    type: ad.type || "marketplace",
  }));
};

export const updateAd = async (id: string, data: Record<string, any>) => {
  const res = await fetch(`${apiUrlsForAds.UPDATEAds}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      price: data.price,
      maGaday: data.maGaday,
    }),
    cache: "no-store",
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
      cache: "no-store",
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
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}
