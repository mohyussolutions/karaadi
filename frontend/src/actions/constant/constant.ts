import { BASE_API_URL } from "./BASE_API_URL";

export const AUTH_ENDPOINTS = {
  USERS_BASE: `${BASE_API_URL}/api/users`,
  LOGIN: `${BASE_API_URL}/api/users/auth`,
  REGISTER: `${BASE_API_URL}/api/users/register`,
  LOGOUT: `${BASE_API_URL}/api/users/logout`,
  CONFIRM: `${BASE_API_URL}/api/users/confirm`,
  RESEND_CODE: `${BASE_API_URL}/api/users/resend-code`,
  VERIFY_SESSION: `${BASE_API_URL}/api/users/verify-session`,
  VERIFY_TOKEN: `${BASE_API_URL}/api/users/verify-token`,
  REFRESH_TOKEN: `${BASE_API_URL}/api/users/refreshtoken`,
  FORGOT_PASSWORD: `${BASE_API_URL}/api/users/forgot-password`,
  RESET_PASSWORD: `${BASE_API_URL}/api/users/reset-password`,
};

export const USER_ENDPOINTS = {
  PROFILE: `${AUTH_ENDPOINTS.USERS_BASE}/profile`,
  DELETE_ACCOUNT: `${AUTH_ENDPOINTS.USERS_BASE}/delete`,

  GET_USER_BY_ID: (id: string) => `${AUTH_ENDPOINTS.USERS_BASE}/${id}`,
};

export const ADS_ENDPOINTS = {
  ADS_BASE: `${BASE_API_URL}/api/ads`,
  MY_ADS: `${BASE_API_URL}/api/ads/my-ads`,
  UPDATE: `${BASE_API_URL}/api/ads/update`,
  DELETE: `${BASE_API_URL}/api/ads/delete`,
};

export const apiUrls = {
  BASE: BASE_API_URL,
  CONFIRM: AUTH_ENDPOINTS.CONFIRM,
  RESEND_CODE: AUTH_ENDPOINTS.RESEND_CODE,
  LOGIN: AUTH_ENDPOINTS.LOGIN,
  REGISTER: AUTH_ENDPOINTS.REGISTER,
  LOGOUT: AUTH_ENDPOINTS.LOGOUT,
  VERIFY_SESSION: AUTH_ENDPOINTS.VERIFY_SESSION,
  VERIFY_TOKEN: AUTH_ENDPOINTS.VERIFY_TOKEN,
  REFRESH_TOKEN: AUTH_ENDPOINTS.REFRESH_TOKEN,
  FORGOT_PASSWORD: AUTH_ENDPOINTS.FORGOT_PASSWORD,
  RESET_PASSWORD: AUTH_ENDPOINTS.RESET_PASSWORD,
  PROFILE: USER_ENDPOINTS.PROFILE,
  DELETE_ACCOUNT: USER_ENDPOINTS.DELETE_ACCOUNT,
  USERS: {
    BASE: AUTH_ENDPOINTS.USERS_BASE,
    BY_ID: USER_ENDPOINTS.GET_USER_BY_ID,
    PROFILE: USER_ENDPOINTS.PROFILE,
    DELETE_ACCOUNT: USER_ENDPOINTS.DELETE_ACCOUNT,
  },
};

export const CATEGORY_TOTALS_ENDPOINTS = {
  Jobs: `${BASE_API_URL}/api/jobs`,
  Cars: `${BASE_API_URL}/api/cars`,
  Boats: `${BASE_API_URL}/api/boats`,
  Motorcycles: `${BASE_API_URL}/api/motorcycles`,
  RealEstate: `${BASE_API_URL}/api/real-estate`,
  Traktors: `${BASE_API_URL}/api/traktor`,
  Marketplace: `${BASE_API_URL}/api/marketplace`,
};

export const apiUrlsForAds = {
  MY_ADS: ADS_ENDPOINTS.MY_ADS,
  DELETEAds: ADS_ENDPOINTS.DELETE,
  UPDATEAds: ADS_ENDPOINTS.UPDATE,
};
export const apiUrlsForFavorites = {
  FAVORITES_BASE: `${BASE_API_URL}/api/favorites`,
  FAVORITES_COUNT: `${BASE_API_URL}/api/favorites/count`,
  GET_FAVORITE_BY_ID: (id: string) => `${BASE_API_URL}/api/favorites/${id}`,
  DELETE_FAVORITE: (id: string) => `${BASE_API_URL}/api/favorites/${id}`,
  UPDATE_FAVORITE: (id: string) => `${BASE_API_URL}/api/favorites/${id}`,
  ADD_FAVORITE: `${BASE_API_URL}/api/favorites`,
};

export const apiUrlsForCategoryTotals = {
  Cars: CATEGORY_TOTALS_ENDPOINTS.Cars,
  Boats: CATEGORY_TOTALS_ENDPOINTS.Boats,
  Motorcycles: CATEGORY_TOTALS_ENDPOINTS.Motorcycles,
  RealEstate: CATEGORY_TOTALS_ENDPOINTS.RealEstate,
  Traktors: CATEGORY_TOTALS_ENDPOINTS.Traktors,
  Marketplace: CATEGORY_TOTALS_ENDPOINTS.Marketplace,

  Jobs: CATEGORY_TOTALS_ENDPOINTS.Jobs,
};
export const AUTH_TOKEN_KEY = "auth_token";

export const ADVERTISEMENT_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/advertisements`,
  GET_ALL: `${BASE_API_URL}/api/advertisements`,
  GET_BY_ID: (id: string) => `${BASE_API_URL}/api/advertisements/${id}`,
  CREATE: `${BASE_API_URL}/api/advertisements`,
  UPDATE: (id: string) => `${BASE_API_URL}/api/advertisements/${id}`,
  DELETE: (id: string) => `${BASE_API_URL}/api/advertisements/${id}`,
  CLICK: (id: string) => `${BASE_API_URL}/api/advertisements/${id}/click`,
  STATS: `${BASE_API_URL}/api/advertisements/stats`,
  TODAY_STATS: `${BASE_API_URL}/api/advertisements/today-stats`,
  USER_ADS: (userId: string) =>
    `${BASE_API_URL}/api/advertisements/user/${userId}`,
};
export const FEE_ENDPOINTS = {
  GET_ACTIVE: `${BASE_API_URL}/api/Fee/active`,
  GET_ALL: `${BASE_API_URL}/api/Fee`,
  GET_LOGS: (id: string) => `${BASE_API_URL}/api/Fee/${id}/logs`,
  CREATE: `${BASE_API_URL}/api/Fee`,
  UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/${id}`,
  DELETE: (id: string) => `${BASE_API_URL}/api/Fee/${id}`,
  STATS: `${BASE_API_URL}/api/Fee/stats`,
  CALCULATE: `${BASE_API_URL}/api/Fee/calculate`,
  TOTAL_FEE: `${BASE_API_URL}/api/Fee/total-fee`,
} as const;

export const PAYMENT_ENDPOINTS = {
  CREATE: `${BASE_API_URL}/api/payments`,
  GET_ALL: `${BASE_API_URL}/api/payments`,
  STATS: `${BASE_API_URL}/api/payments/stats`,
  SEARCH: `${BASE_API_URL}/api/payments/search`,
  GET_MY_PAYMENTS: `${BASE_API_URL}/api/payments/me`,
  UPDATE_STATUS: (id: string) => `${BASE_API_URL}/api/payments/${id}/status`,
  DELETE: (id: string) => `${BASE_API_URL}/api/payments/${id}`,
  GET_ITEM_DETAIL: (id: string) => `${BASE_API_URL}/api/payments/item/${id}`,
};

export const SUBS_ENDPOINTS = {
  CREATE: `${BASE_API_URL}/api/Subscription`,
  GET_USER_SUBSCRIPTIONS: (userId: string) =>
    `${BASE_API_URL}/api/Subscription/user/${userId}`,
  SEARCH: `${BASE_API_URL}/api/Subscription/search`,
  GET_ALL: `${BASE_API_URL}/api/Subscription`,
  ADMIN_ALL: `${BASE_API_URL}/api/Subscription/admin/all`,
  ADMIN_DELETE: (id: string) => `${BASE_API_URL}/api/Subscription/admin/${id}`,
  ADMIN_UPDATE_STATUS: (id: string) =>
    `${BASE_API_URL}/api/Subscription/admin/${id}/status`,
  ADMIN_NOTIFY: `${BASE_API_URL}/api/Subscription/admin/notify`,
  STATS: `${BASE_API_URL}/api/Subscription/stats`,
  TOTAL: `${BASE_API_URL}/api/Subscription/total`,
} as const;
export const AGENCY_ENDPOINTS = {
  STATS: `${BASE_API_URL}/api/agencies/stats`,
  BASE: `${BASE_API_URL}/api/agencies`,
  ADD_MEMBER: `${BASE_API_URL}/api/agencies/add-user`,
  BY_ID: (id: string) => `${BASE_API_URL}/api/agencies/${id}`,
};
export const REPORT_ENDPOINTS = {
  CREATE: `${BASE_API_URL}/api/reports`,
  GET_ALL: `${BASE_API_URL}/api/reports`,
  GET_BY_ID: (id: string) => `${BASE_API_URL}/api/reports/${id}`,
  UPDATE_STATUS: (id: string) => `${BASE_API_URL}/api/reports/${id}/status`,
  DELETE: (id: string) => `${BASE_API_URL}/api/reports/${id}`,
  STATS: `${BASE_API_URL}/api/reports/stats`,
};
export const SEARCH_ENDPOINT = `${BASE_API_URL}/api/search`;
export const FILTERING_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/filtering`,
  GLOBAL: `/global-filter`,
  METADATA: `/metadata`,
};

export const SUPPORT_ENDPOINTS = {
  CREATE_TICKET: `${BASE_API_URL}/api/support/tickets`,
  GET_TICKETS: `${BASE_API_URL}/api/support/tickets`,
  GET_TICKET_BY_ID: (id: string) => `${BASE_API_URL}/api/support/tickets/${id}`,
  ADD_MESSAGE: (id: string) =>
    `${BASE_API_URL}/api/support/tickets/${id}/messages`,
  CLOSE_TICKET: (id: string) =>
    `${BASE_API_URL}/api/support/tickets/${id}/close`,
};
