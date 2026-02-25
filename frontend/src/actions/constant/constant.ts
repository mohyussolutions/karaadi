import { BASE_API_URL } from "./BASE_API_URL";
export const AUTH_TOKEN_KEY = "auth_token";
export const SEARCH_ENDPOINT = `${BASE_API_URL}/api/search`;

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
  TraktorsAdmin: `${BASE_API_URL}/api/traktor/all-including-unpaid`,
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
  TraktorsAdmin: CATEGORY_TOTALS_ENDPOINTS.TraktorsAdmin,
  Marketplace: CATEGORY_TOTALS_ENDPOINTS.Marketplace,
  Jobs: CATEGORY_TOTALS_ENDPOINTS.Jobs,
};

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
  CREATE: `${BASE_API_URL}/api/subscription`,
  GET_USER_SUBSCRIPTIONS: (userId: string) =>
    `${BASE_API_URL}/api/subscription/user/${userId}`,
  SEARCH: `${BASE_API_URL}/api/subscription/search`,
  GET_ALL: `${BASE_API_URL}/api/subscription`,
  ADMIN_ALL: `${BASE_API_URL}/api/subscription/admin/all`,
  ADMIN_DELETE: (id: string) => `${BASE_API_URL}/api/subscription/admin/${id}`,
  ADMIN_UPDATE_STATUS: (id: string) =>
    `${BASE_API_URL}/api/subscription/admin/${id}/status`,
  ADMIN_NOTIFY: `${BASE_API_URL}/api/subscription/admin/notify`,
  STATS: `${BASE_API_URL}/api/subscription/stats`,
  TOTAL: `${BASE_API_URL}/api/subscription/total`,
  GET_SUBSCRIPTION: `${BASE_API_URL}/api/subscription/allpaid`,
  GET_MY_SUBSCRIPTIONS: `${BASE_API_URL}/api/subscription/my`,
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

export const FILTERING_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/filtering`,
  GLOBAL: `${BASE_API_URL}/api/filtering/global-filter`,
  METADATA: `${BASE_API_URL}/api/filtering/metadata`,
  RANGE_PRICE_ROOMS: `${BASE_API_URL}/api/filtering/range-price-rooms`,
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
export const REAL_ESTATE_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/real-estate`,
  ADMIN_ALL: `${BASE_API_URL}/api/real-estate/all-including-unpaid`,
  BY_ID: (id: string) => `${BASE_API_URL}/api/real-estate/${id}`,
};
export const geoEndpoints = {
  GET_ALL_REGIONS: `${BASE_API_URL}/api/locations/regions`,
  GET_REGION_BY_ID: (id: string) =>
    `${BASE_API_URL}/api/locations/regions/${id}`,
  ADD_REGION: `${BASE_API_URL}/api/locations/regions`,
  UPDATE_REGION: (id: string) => `${BASE_API_URL}/api/locations/regions/${id}`,
  DELETE_REGION: (id: string) => `${BASE_API_URL}/api/locations/regions/${id}`,
  GET_GEO_STATS: `${BASE_API_URL}/api/locations/stats`,
  GET_ALL_CITIES: `${BASE_API_URL}/api/locations/cities`,
  GET_CITY_BY_ID: (id: string) => `${BASE_API_URL}/api/locations/cities/${id}`,
  ADD_CITY: `${BASE_API_URL}/api/locations/cities`,
  UPDATE_CITY: (id: string) => `${BASE_API_URL}/api/locations/cities/${id}`,
  DELETE_CITY: (id: string) => `${BASE_API_URL}/api/locations/cities/${id}`,
  TOTAL_STATS: `${BASE_API_URL}/api/locations/stats`,
  SYNC_DATA: `${BASE_API_URL}/sync`,
};

export const FAVORITE_ROUTES = {
  MY_FAVORITES: `${BASE_API_URL}/api/favorites/my`,
  BASE: `${BASE_API_URL}/api/favorites`,
  BY_ID: (id: string) => `${BASE_API_URL}/api/favorites/${id}`,
  GET_FAVORITE_BY_ID: (id: string) => `${BASE_API_URL}/api/favorites/${id}`,
  DELETE_FAVORITE: (id: string) => `${BASE_API_URL}/api/favorites/${id}`,
  UPDATE_FAVORITE: (id: string) => `${BASE_API_URL}/api/favorites/${id}`,
  ADD_FAVORITE: `${BASE_API_URL}/api/favorites`,
  FAVORITES_COUNT: `${BASE_API_URL}/api/favorites/count`,
};

export const SEARCH_HISTORY_ENDPOINTS = {
  SEARCH_HISTORY: `${BASE_API_URL}/history-search`,
  LOG_SEARCH: `${BASE_API_URL}/history-search/log`,
  POPULAR_SEARCHES: `${BASE_API_URL}/history-search/admin/popular`,
  DELETE_BY_QUERY: `${BASE_API_URL}/history-search/delete-by-query`,
  DELETE_BY_ID: (id: string) => `${BASE_API_URL}/history-search/delete/${id}`,
  SEARCH_ITEMS: (query: string) => `${BASE_API_URL}/api/search?q=${query}`,
};

export const FEE_ENDPOINTS = {
  MARKETPLACE: {
    GET_ALL: `${BASE_API_URL}/api/Fee/marketplace`,
    GET_BY_ID: (id: string) => `${BASE_API_URL}/api/Fee/marketplace/${id}`,
    CREATE: `${BASE_API_URL}/api/Fee/marketplace`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/marketplace/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/Fee/marketplace/${id}`,
  },
  REAL_ESTATE: {
    GET_ALL: `${BASE_API_URL}/api/Fee/real-estate`,
    GET_BY_ID: (id: string) => `${BASE_API_URL}/api/Fee/real-estate/${id}`,
    CREATE: `${BASE_API_URL}/api/Fee/real-estate`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/real-estate/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/Fee/real-estate/${id}`,
  },
  CARS: {
    GET_ALL: `${BASE_API_URL}/api/Fee/cars`,
    GET_BY_ID: (id: string) => `${BASE_API_URL}/api/Fee/cars/${id}`,
    CREATE: `${BASE_API_URL}/api/Fee/cars`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/cars/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/Fee/cars/${id}`,
  },
  MOTORCYCLES: {
    GET_ALL: `${BASE_API_URL}/api/Fee/motorcycles`,
    GET_BY_ID: (id: string) => `${BASE_API_URL}/api/Fee/motorcycles/${id}`,
    CREATE: `${BASE_API_URL}/api/Fee/motorcycles`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/motorcycles/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/Fee/motorcycles/${id}`,
  },
  BOATS: {
    GET_ALL: `${BASE_API_URL}/api/Fee/boats`,
    GET_BY_ID: (id: string) => `${BASE_API_URL}/api/Fee/boats/${id}`,
    CREATE: `${BASE_API_URL}/api/Fee/boats`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/boats/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/Fee/boats/${id}`,
  },
  EQUIPMENT: {
    GET_ALL: `${BASE_API_URL}/api/Fee/equipment`,
    GET_BY_ID: (id: string) => `${BASE_API_URL}/api/Fee/equipment/${id}`,
    CREATE: `${BASE_API_URL}/api/Fee/equipment`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/equipment/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/Fee/equipment/${id}`,
  },
  SYSTEM_CONFIG: {
    GET: `${BASE_API_URL}/api/Fee/system-config`,
    CREATE: `${BASE_API_URL}/api/Fee/system-config`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/system-config/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/Fee/system-config/${id}`,
  },
  SUB_PLANS: {
    GET_ALL: `${BASE_API_URL}/api/Fee/sub-plans`,
    GET_BY_ID: (id: string) => `${BASE_API_URL}/api/Fee/sub-plans/${id}`,
    CREATE: `${BASE_API_URL}/api/Fee/sub-plans`,
    UPDATE: (id: string) => `${BASE_API_URL}/api/Fee/sub-plans/${id}`,
    DELETE: (id: string) => `${BASE_API_URL}/api/Fee/sub-plans/${id}`,
  },
} as const;
