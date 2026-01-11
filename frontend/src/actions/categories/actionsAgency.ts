import { AGENCY_ENDPOINTS } from "../constant/constant";

export const getAgencyStats = async () => {
  try {
    const response = await fetch(AGENCY_ENDPOINTS.STATS, {
      credentials: "include",
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    return { success: false, total: 0, verified: 0 };
  }
};

export const fetchAgencies = async () => {
  try {
    const response = await fetch(AGENCY_ENDPOINTS.BASE, {
      credentials: "include",
      cache: "no-store",
    });
    const data = await response.json();
    return data.agencies || [];
  } catch (error) {
    return [];
  }
};

export const createAgency = async (agencyData: any) => {
  try {
    const response = await fetch(AGENCY_ENDPOINTS.BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(agencyData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: "Creation failed" };
  }
};

export const updateAgency = async (id: string, agencyData: any) => {
  try {
    const response = await fetch(AGENCY_ENDPOINTS.BY_ID(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(agencyData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: "Update failed" };
  }
};

export const deleteAgency = async (id: string) => {
  try {
    const response = await fetch(AGENCY_ENDPOINTS.BY_ID(id), {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: "Delete failed" };
  }
};
