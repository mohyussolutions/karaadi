import { SUBS_ENDPOINTS } from "../constant/constant";

export async function createSubscription(data: {
  userId: string;
  title: string;
  category: string;
  subCategory?: string;
  region: string;
  city: string;
  priceMin?: string;
  priceMax?: string;
  description?: string;
  condition?: string;
  brand?: string;
  model?: string;
  specificFeatures?: string;
}) {
  const res = await fetch(SUBS_ENDPOINTS.CREATE, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to create subscription: ${await res.text()}`);
  return res.json();
}

export async function getUserSubscriptions(userId: string) {
  const res = await fetch(SUBS_ENDPOINTS.GET_USER_SUBSCRIPTIONS(userId), {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch subscriptions: ${await res.text()}`);
  const data = await res.json();
  return data.subscriptions;
}

export async function searchSubscriptions(filters: {
  category?: string;
  subCategory?: string;
  region?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  model?: string;
  condition?: string;
}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const res = await fetch(`${SUBS_ENDPOINTS.SEARCH}?${params.toString()}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to search subscriptions: ${await res.text()}`);
  const data = await res.json();
  return data.subscriptions;
}

export async function getAllSubscriptionsAdmin(filters: {
  search?: string;
  category?: string;
  region?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });

  const res = await fetch(`${SUBS_ENDPOINTS.ADMIN_ALL}?${params.toString()}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch subscriptions: ${await res.text()}`);
  const data = await res.json();
  return data.subscriptions;
}

export async function updateSubscriptionStatus(
  id: string,
  data: {
    status: "active" | "inactive" | "paused";
    isActive?: boolean;
  }
) {
  const res = await fetch(SUBS_ENDPOINTS.ADMIN_UPDATE_STATUS(id), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to update subscription: ${await res.text()}`);
  return res.json();
}

export async function deleteSubscriptionAdmin(id: string) {
  const res = await fetch(SUBS_ENDPOINTS.ADMIN_DELETE(id), {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to delete subscription: ${await res.text()}`);
  return res.json();
}

export async function getSubscriptionStats(period = "all") {
  const res = await fetch(`${SUBS_ENDPOINTS.STATS}?period=${period}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch subscription stats: ${await res.text()}`);
  const data = await res.json();
  return data.stats;
}

export async function getTotalSubscriptions() {
  const res = await fetch(SUBS_ENDPOINTS.TOTAL, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch total subscriptions: ${await res.text()}`);
  const data = await res.json();
  return data;
}

export async function triggerManualNotification(data: {
  itemType: string;
  itemId: string;
  mainCategory: string;
  category: string;
  subcategory: string;
  region: string;
  city: string;
  title: string;
  price: number;
  posterId: string;
}) {
  const res = await fetch(SUBS_ENDPOINTS.ADMIN_NOTIFY, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`Failed to trigger notification: ${await res.text()}`);
  return res.json();
}

export async function checkExistingSubscription(
  userId: string,
  category: string,
  region: string,
  city: string
) {
  try {
    const subscriptions = await getUserSubscriptions(userId);
    return (
      subscriptions?.some(
        (sub: any) =>
          sub.category === category &&
          sub.region === region &&
          sub.city === city &&
          sub.isActive === true
      ) || false
    );
  } catch (error) {
    console.error("Error checking existing subscription:", error);
    return false;
  }
}

export async function getAllSubscriptions() {
  const res = await fetch(SUBS_ENDPOINTS.GET_ALL || SUBS_ENDPOINTS.CREATE, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch all subscriptions: ${await res.text()}`);
  const data = await res.json();
  return data.subscriptions;
}
