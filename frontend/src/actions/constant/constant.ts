import { GridConfiguration } from "@/app/utils/types/GridConfiguration";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://karaadi.onrender.com";

export const AUTH_TOKEN_KEY = "auth_token";
export const PLACEHOLDER_IMAGE =
  "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";
export const PLACEHOLDER = "/placeholder.png";
export const INITIAL_DISPLAY = 50;
export const DISPLAY_INCREMENT = 20;

export const PRIORITY_CONFIG = {
  PREMIUM: { label: "PREMIUM", color: "bg-amber-500" },
  STANDARD: { label: "STANDARD", color: "bg-blue-500" },
  BASIC: { label: "BASIC", color: "bg-gray-500" },
} as const;

export const getPriorityBadge = (
  isPremium90?: boolean,
  isStandard60?: boolean,
  isBasic30?: boolean,
) => {
  if (isPremium90) return PRIORITY_CONFIG.PREMIUM;
  if (isStandard60) return PRIORITY_CONFIG.STANDARD;
  if (isBasic30) return PRIORITY_CONFIG.BASIC;
  return null;
};

export const INITIAL_COUNT = 52;
export const INCREMENT = 20;
export const MAX_COUNT = 120;

export const GRID_CONFIG: GridConfiguration = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
  INITIAL_LOAD: 60,
  ITEMS_PER_LOAD: 10,
  MAX_ITEMS: 120,
  MAX_LOADS: 3,
};

export const OPTION = {
  Public: "Public",
  Private: "Private",
} as const;

const createEndpoint = (path: string): string => `${BASE_API_URL}${path}`;
const createIdEndpoint = (base: string, id: string | number): string =>
  `${BASE_API_URL}${base}/${id}`;
const createUserEndpoint = (base: string, userId: string): string =>
  `${BASE_API_URL}${base}/${userId}`;

const API_PATHS = {
  USERS: "/api/users",
  ADS: "/api/listings",
  CARS: "/api/cars",
  BOATS: "/api/boats",
  MOTORCYCLES: "/api/motorcycles",
  REAL_ESTATE: "/api/real-estate",
  TRAKTOR: "/api/traktor",
  MARKETPLACE: "/api/marketplace",
  FAVORITES: "/api/favorites",
  JOBS: "/api/jobs",
  SUBSCRIPTION: "/api/subscription",
  PAYMENTS: "/api/payments",
  FILTERING: "/api/filtering",
  SUPPORT: "/api/support",
  LOCATIONS: "/api/locations",
  HISTORY_SEARCH: "/api/history-search",
  REPORTS: "/api/reports",
  FEE: "/api/Fee",
  FEED: "/api/feed",
  RECOMMENDATIONS: "/api/recommendations",
  ADVERTISEMENTS: "/api/advertisements",
  CONTACT_US: "/api/contactUs",
  BUSINESSES: "/api/businesses",
  BUSINESS_PLANS: "/api/business-plans",
} as const;

export const SEARCH_ENDPOINT = createEndpoint("/api/search");

export const AUTH_ENDPOINTS = {
  USERS_BASE: createEndpoint(API_PATHS.USERS),
  LOGIN: createEndpoint(`${API_PATHS.USERS}/auth`),
  REGISTER: createEndpoint(`${API_PATHS.USERS}/register`),
  LOGOUT: createEndpoint(`${API_PATHS.USERS}/logout`),
  CONFIRM: createEndpoint(`${API_PATHS.USERS}/confirm`),
  RESEND_CODE: createEndpoint(`${API_PATHS.USERS}/resend-code`),
  VERIFY_SESSION: createEndpoint(`${API_PATHS.USERS}/verify-session`),
  VERIFY_TOKEN: createEndpoint(`${API_PATHS.USERS}/verify-token`),
  REFRESH_TOKEN: createEndpoint(`${API_PATHS.USERS}/refreshtoken`),
  FORGOT_PASSWORD: createEndpoint(`${API_PATHS.USERS}/forgot-password`),
  RESET_PASSWORD: createEndpoint(`${API_PATHS.USERS}/reset-password`),
};

export const USER_ENDPOINTS = {
  PROFILE: createEndpoint(`${API_PATHS.USERS}/profile`),
  UPDATE_PHONE: createEndpoint(`${API_PATHS.USERS}/profile/phone`),
  UPDATE_PROFILE: createEndpoint(`${API_PATHS.USERS}/profile/image`),
  DELETE_ACCOUNT: createEndpoint(`${API_PATHS.USERS}/delete-account`),
  VERIFY_SESSION: AUTH_ENDPOINTS.VERIFY_SESSION,
  GET_USER_BY_ID: (id: string) => createUserEndpoint(API_PATHS.USERS, id),
};

export const ADS_ENDPOINTS = {
  ADS_BASE: createEndpoint(API_PATHS.ADS),
  MY_ADS: createEndpoint(`${API_PATHS.ADS}/my-ads`),
  UPDATE: createEndpoint(`${API_PATHS.ADS}/update`),
  DELETE: createEndpoint(`${API_PATHS.ADS}/delete`),
  PATCH: (id: string) => createIdEndpoint(API_PATHS.ADS, id),
};

export const CATEGORY_ENDPOINTS = {
  CARS: createEndpoint(API_PATHS.CARS),
  BOATS: createEndpoint(API_PATHS.BOATS),
  MOTORCYCLES: createEndpoint(API_PATHS.MOTORCYCLES),
  REAL_ESTATE: createEndpoint(API_PATHS.REAL_ESTATE),
  TRAKTOR: createEndpoint(API_PATHS.TRAKTOR),
  MARKETPLACE: createEndpoint(API_PATHS.MARKETPLACE),
  CARS_ADMIN: createEndpoint(`${API_PATHS.CARS}/all-including-unpaid`),
  BOATS_ADMIN: createEndpoint(`${API_PATHS.BOATS}/all-including-unpaid`),
  MOTORCYCLES_ADMIN: createEndpoint(
    `${API_PATHS.MOTORCYCLES}/all-including-unpaid`,
  ),
  REAL_ESTATE_ADMIN: createEndpoint(
    `${API_PATHS.REAL_ESTATE}/all-including-unpaid`,
  ),
  TRAKTOR_ADMIN: createEndpoint(`${API_PATHS.TRAKTOR}/all-including-unpaid`),
  MARKETPLACE_ADMIN: createEndpoint(
    `${API_PATHS.MARKETPLACE}/all-including-unpaid`,
  ),
  DELETE_ITEM: (id: string) => createIdEndpoint(API_PATHS.MARKETPLACE, id),
  UPDATE_ITEM: (id: string) => createIdEndpoint(API_PATHS.MARKETPLACE, id),
  TOTAL_CARS: createEndpoint(`${API_PATHS.CARS}/total`),
  TOTAL_BOATS: createEndpoint(`${API_PATHS.BOATS}/total`),
  TOTAL_MOTORCYCLES: createEndpoint(`${API_PATHS.MOTORCYCLES}/total`),
  TOTAL_REAL_ESTATE: createEndpoint(`${API_PATHS.REAL_ESTATE}/total`),
  TOTAL_FARM_EQUIPMENT: createEndpoint(`${API_PATHS.TRAKTOR}/total`),
  TOTAL_MARKETPLACE: createEndpoint(`${API_PATHS.MARKETPLACE}/total`),
};

export const FAVORITE_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.FAVORITES),
  MY_FAVORITES: createEndpoint(`${API_PATHS.FAVORITES}/my`),
  COUNT: createEndpoint(`${API_PATHS.FAVORITES}/count`),
  ADD: createEndpoint(API_PATHS.FAVORITES),
  GET_BY_ID: (id: string) => createIdEndpoint(API_PATHS.FAVORITES, id),
  DELETE: (id: string) => createIdEndpoint(API_PATHS.FAVORITES, id),
  UPDATE: (id: string) => createIdEndpoint(API_PATHS.FAVORITES, id),
};

export const JOBS_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.JOBS),
  CREATE: createEndpoint(API_PATHS.JOBS),
  GET_ALL: createEndpoint(API_PATHS.JOBS),
  TOTAL: createEndpoint(`${API_PATHS.JOBS}/total`),
  UPDATE: (id: string) => createIdEndpoint(API_PATHS.JOBS, id),
  DELETE: (id: string) => createIdEndpoint(API_PATHS.JOBS, id),
  GET_BY_ID: (id: string) => createIdEndpoint(API_PATHS.JOBS, id),
};

export const SUBSCRIPTION_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.SUBSCRIPTION),
  CREATE: createEndpoint(API_PATHS.SUBSCRIPTION),
  GET_ALL: createEndpoint(API_PATHS.SUBSCRIPTION),
  ADMIN_ALL: createEndpoint(`${API_PATHS.SUBSCRIPTION}/admin/all`),
  STATS: createEndpoint(`${API_PATHS.SUBSCRIPTION}/stats`),
  TOTAL: createEndpoint(`${API_PATHS.SUBSCRIPTION}/total`),
  GET_SUBSCRIPTION: createEndpoint(`${API_PATHS.SUBSCRIPTION}/allpaid`),
  GET_MY_SUBSCRIPTIONS: createEndpoint(`${API_PATHS.SUBSCRIPTION}/my`),
  SEARCH: createEndpoint(`${API_PATHS.SUBSCRIPTION}/search`),
  GET_USER_SUBSCRIPTIONS: (userId: string) =>
    createUserEndpoint(`${API_PATHS.SUBSCRIPTION}/user`, userId),
  ADMIN_DELETE: (id: string) =>
    createIdEndpoint(`${API_PATHS.SUBSCRIPTION}/admin`, id),
  ADMIN_UPDATE_STATUS: (id: string) =>
    createEndpoint(`${API_PATHS.SUBSCRIPTION}/admin/${id}/status`),
  ADMIN_NOTIFY: createEndpoint(`${API_PATHS.SUBSCRIPTION}/admin/notify`),
  DELETE: (id: string) => createIdEndpoint(API_PATHS.SUBSCRIPTION, id),
};

export const PAYMENT_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.PAYMENTS),
  CREATE: createEndpoint(API_PATHS.PAYMENTS),
  GET_ALL: createEndpoint(API_PATHS.PAYMENTS),
  STATS: createEndpoint(`${API_PATHS.PAYMENTS}/stats`),
  SEARCH: createEndpoint(`${API_PATHS.PAYMENTS}/search`),
  GET_MY_PAYMENTS: createEndpoint(`${API_PATHS.PAYMENTS}/me`),
  TRANSACTIONS: createEndpoint("/api/finance/transactions"),
  GET_BY_ID: (id: string) => createIdEndpoint(API_PATHS.PAYMENTS, id),
  UPDATE_STATUS: (id: string) =>
    createEndpoint(`${API_PATHS.PAYMENTS}/${id}/status`),
  DELETE: (id: string) => createIdEndpoint(API_PATHS.PAYMENTS, id),
  GET_ITEM_DETAIL: (id: string) =>
    createIdEndpoint(`${API_PATHS.PAYMENTS}/item`, id),
  WAAFI_INITIATE: createEndpoint(`${API_PATHS.PAYMENTS}/waafi/initiate`),
  WAAFI_STATUS: (ref: string) =>
    createEndpoint(`${API_PATHS.PAYMENTS}/waafi/status/${ref}`),
  MOBILE_INITIATE: createEndpoint(`${API_PATHS.PAYMENTS}/mobile/initiate`),
  MOBILE_STATUS: (ref: string) =>
    createEndpoint(`${API_PATHS.PAYMENTS}/mobile/status/${ref}`),
};

export const FEED_ENDPOINTS = {
  PAGE: (page: number, pageSize = 70) =>
    createEndpoint(`${API_PATHS.FEED}?page=${page}&pageSize=${pageSize}`),
};

export const FILTERING_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.FILTERING),
  GLOBAL: createEndpoint(`${API_PATHS.FILTERING}/global-filter`),
  METADATA: createEndpoint(`${API_PATHS.FILTERING}/metadata`),
  RANGE_PRICE_ROOMS: createEndpoint(`${API_PATHS.FILTERING}/range-price-rooms`),
};

export const SUPPORT_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.SUPPORT),
  CREATE_TICKET: createEndpoint(`${API_PATHS.SUPPORT}/tickets`),
  GET_TICKETS: createEndpoint(`${API_PATHS.SUPPORT}/tickets`),
  GET_TICKET_BY_ID: (id: string) =>
    createIdEndpoint(`${API_PATHS.SUPPORT}/tickets`, id),
  ADD_MESSAGE: (id: string) =>
    createEndpoint(`${API_PATHS.SUPPORT}/tickets/${id}/messages`),
  CLOSE_TICKET: (id: string) =>
    createEndpoint(`${API_PATHS.SUPPORT}/tickets/${id}/close`),
};

export const REAL_ESTATE_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.REAL_ESTATE),
  ADMIN_ALL: createEndpoint(`${API_PATHS.REAL_ESTATE}/all-including-unpaid`),
  TOTAL: createEndpoint(`${API_PATHS.REAL_ESTATE}/total`),
  BY_ID: (id: string) => createIdEndpoint(API_PATHS.REAL_ESTATE, id),
};

export const GEO_ENDPOINTS = {
  GET_ALL_REGIONS: createEndpoint(`${API_PATHS.LOCATIONS}/regions`),
  GET_ALL_CITIES: createEndpoint(`${API_PATHS.LOCATIONS}/cities`),
  GET_GEO_STATS: createEndpoint(`${API_PATHS.LOCATIONS}/stats`),
  SYNC_DATA: createEndpoint(`${API_PATHS.LOCATIONS}/sync`),
  GET_REGION_BY_ID: (id: string) =>
    createIdEndpoint(`${API_PATHS.LOCATIONS}/regions`, id),
  ADD_REGION: createEndpoint(`${API_PATHS.LOCATIONS}/regions`),
  UPDATE_REGION: (id: string) =>
    createIdEndpoint(`${API_PATHS.LOCATIONS}/regions`, id),
  DELETE_REGION: (id: string) =>
    createIdEndpoint(`${API_PATHS.LOCATIONS}/regions`, id),
  GET_CITY_BY_ID: (id: string) =>
    createIdEndpoint(`${API_PATHS.LOCATIONS}/cities`, id),
  ADD_CITY: createEndpoint(`${API_PATHS.LOCATIONS}/cities`),
  UPDATE_CITY: (id: string) =>
    createIdEndpoint(`${API_PATHS.LOCATIONS}/cities`, id),
  DELETE_CITY: (id: string) =>
    createIdEndpoint(`${API_PATHS.LOCATIONS}/cities`, id),
};

export const SEARCH_HISTORY_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.HISTORY_SEARCH),
  LOG_SEARCH: createEndpoint(`${API_PATHS.HISTORY_SEARCH}/log`),
  POPULAR_SEARCHES: createEndpoint(`${API_PATHS.HISTORY_SEARCH}/admin/popular`),
  DELETE_BY_QUERY: createEndpoint(
    `${API_PATHS.HISTORY_SEARCH}/delete-by-query`,
  ),
  SEARCH_ITEMS: (query: string) =>
    `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}`,
  DELETE_BY_ID: (id: string) =>
    createIdEndpoint(`${API_PATHS.HISTORY_SEARCH}/delete`, id),
};

export const REPORT_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.REPORTS),
  CREATE: createEndpoint(API_PATHS.REPORTS),
  GET_ALL: createEndpoint(API_PATHS.REPORTS),
  SUMMARY: createEndpoint(`${API_PATHS.REPORTS}/summary`),
  STATS: createEndpoint(`${API_PATHS.REPORTS}/stats`),
  TOTAL: createEndpoint(`${API_PATHS.REPORTS}/total`),
  USER_REPORTS: (userId: string) =>
    createUserEndpoint(`${API_PATHS.REPORTS}/user`, userId),
  GET_BY_ID: (id: string) => createIdEndpoint(API_PATHS.REPORTS, id),
  UPDATE_STATUS: (id: string) => createIdEndpoint(API_PATHS.REPORTS, id),
  DELETE: (id: string) => createIdEndpoint(API_PATHS.REPORTS, id),
};

export const RECOMMENDATION_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.RECOMMENDATIONS),
  TRACK_VIEW: createEndpoint(`${API_PATHS.RECOMMENDATIONS}/track-view`),
  MOST_VIEWED_CATEGORIES: createEndpoint(
    `${API_PATHS.RECOMMENDATIONS}/categories/most-viewed`,
  ),
  USER_TOP_CATEGORIES: createEndpoint(
    `${API_PATHS.RECOMMENDATIONS}/categories/user-top`,
  ),
  TRENDING_CATEGORIES: createEndpoint(
    `${API_PATHS.RECOMMENDATIONS}/categories/trending`,
  ),
  MOST_CLICKED_ITEMS: createEndpoint(
    `${API_PATHS.RECOMMENDATIONS}/items/most-clicked`,
  ),
  CATEGORY_CTR: (cat: string) =>
    createEndpoint(
      `${API_PATHS.RECOMMENDATIONS}/categories/${encodeURIComponent(cat)}/ctr`,
    ),
  RECOMMENDATION_BY_ID: (id: number) =>
    createIdEndpoint(API_PATHS.RECOMMENDATIONS, id),
  RECOMMENDATION_BY_EXTERNAL_ID: (eid: string) =>
    createEndpoint(`${API_PATHS.RECOMMENDATIONS}/external/${eid}`),
};

export const ADVERTISEMENT_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.ADVERTISEMENTS),
  GET_ALL: createEndpoint(API_PATHS.ADVERTISEMENTS),
  CREATE: createEndpoint(API_PATHS.ADVERTISEMENTS),
  STATS: createEndpoint(`${API_PATHS.ADVERTISEMENTS}/stats`),
  TODAY_STATS: createEndpoint(`${API_PATHS.ADVERTISEMENTS}/today-stats`),
  GET_BY_ID: (id: string) => createIdEndpoint(API_PATHS.ADVERTISEMENTS, id),
  UPDATE: (id: string) => createIdEndpoint(API_PATHS.ADVERTISEMENTS, id),
  DELETE: (id: string) => createIdEndpoint(API_PATHS.ADVERTISEMENTS, id),
  CLICK: (id: string) =>
    createEndpoint(`${API_PATHS.ADVERTISEMENTS}/${id}/click`),
  USER_ADS: (userId: string) =>
    createUserEndpoint(`${API_PATHS.ADVERTISEMENTS}/user`, userId),
};

export const BUSINESS_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.BUSINESSES),
  CREATE: createEndpoint(API_PATHS.BUSINESSES),
  MY: createEndpoint(`${API_PATHS.BUSINESSES}/my`),
  STATS: createEndpoint(`${API_PATHS.BUSINESSES}/stats`),
  TOTAL: createEndpoint(`${API_PATHS.BUSINESSES}/total`),
  ADMIN_ALL: createEndpoint(`${API_PATHS.BUSINESSES}/admin/all`),
  ADMIN_UPDATE_STATUS: (id: string) =>
    createEndpoint(`${API_PATHS.BUSINESSES}/admin/${id}/status`),
  ADMIN_TOGGLE_VISIBILITY: (id: string) =>
    createEndpoint(`${API_PATHS.BUSINESSES}/admin/${id}/toggle-visibility`),
  ADMIN_ASSIGN_PLAN: (id: string) =>
    createEndpoint(`${API_PATHS.BUSINESSES}/admin/${id}/assign-plan`),
  ADMIN_SET_POST_LIMIT: (id: string) =>
    createEndpoint(`${API_PATHS.BUSINESSES}/admin/${id}/post-limit`),
  BY_ID: (id: string) => createIdEndpoint(API_PATHS.BUSINESSES, id),
  UPDATE: (id: string) => createIdEndpoint(API_PATHS.BUSINESSES, id),
  DELETE: (id: string) => createIdEndpoint(API_PATHS.BUSINESSES, id),
  CAN_POST: createEndpoint(`${API_PATHS.BUSINESSES}/can-post`),
  SELECT_PLAN: (id: string) =>
    createEndpoint(`${API_PATHS.BUSINESSES}/${id}/select-plan`),
  EXTEND_PLAN: (id: string) =>
    createEndpoint(`${API_PATHS.BUSINESSES}/${id}/extend-plan`),
  ADD_MEMBER: (id: string) =>
    createEndpoint(`${API_PATHS.BUSINESSES}/${id}/members`),
  REMOVE_MEMBER: (id: string, memberId: string) =>
    createEndpoint(`${API_PATHS.BUSINESSES}/${id}/members/${memberId}`),
};

export const BUSINESS_PLAN_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.BUSINESS_PLANS),
  GET_ALL: createEndpoint(API_PATHS.BUSINESS_PLANS),
  ADMIN_ALL: createEndpoint(`${API_PATHS.BUSINESS_PLANS}/admin/all`),
  BY_ID: (id: string) => createIdEndpoint(API_PATHS.BUSINESS_PLANS, id),
  CREATE: createEndpoint(API_PATHS.BUSINESS_PLANS),
  UPDATE: (id: string) => createIdEndpoint(API_PATHS.BUSINESS_PLANS, id),
  DELETE: (id: string) => createIdEndpoint(API_PATHS.BUSINESS_PLANS, id),
};

export const CONTACT_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.CONTACT_US),
  TICKETS: createEndpoint(`${API_PATHS.CONTACT_US}/tickets`),
  STATS: createEndpoint(`${API_PATHS.CONTACT_US}/stats`),
  TICKET_BY_ID: (id: string | number) =>
    createIdEndpoint(`${API_PATHS.CONTACT_US}/tickets`, id),
  MESSAGES: (id: string | number) =>
    createEndpoint(`${API_PATHS.CONTACT_US}/tickets/${id}/messages`),
};

const createFeeCategoryEndpoints = (category: string) => ({
  GET_ALL: createEndpoint(`${API_PATHS.FEE}/${category}`),
  GET_BY_ID: (id: string) =>
    createIdEndpoint(`${API_PATHS.FEE}/${category}`, id),
  CREATE: createEndpoint(`${API_PATHS.FEE}/${category}`),
  UPDATE: (id: string) => createIdEndpoint(`${API_PATHS.FEE}/${category}`, id),
  DELETE: (id: string) => createIdEndpoint(`${API_PATHS.FEE}/${category}`, id),
});

export const FEE_ENDPOINTS = {
  MARKETPLACE: createFeeCategoryEndpoints("marketplace"),
  REAL_ESTATE: createFeeCategoryEndpoints("real-estate"),
  CARS: createFeeCategoryEndpoints("cars"),
  MOTORCYCLES: createFeeCategoryEndpoints("motorcycles"),
  BOATS: createFeeCategoryEndpoints("boats"),
  EQUIPMENT: createFeeCategoryEndpoints("equipment"),
  SYSTEM_CONFIG: {
    GET: createEndpoint(`${API_PATHS.FEE}/system-config`),
    CREATE: createEndpoint(`${API_PATHS.FEE}/system-config`),
    UPDATE: (id: string) =>
      createIdEndpoint(`${API_PATHS.FEE}/system-config`, id),
    DELETE: (id: string) =>
      createIdEndpoint(`${API_PATHS.FEE}/system-config`, id),
  },
  SUB_PLANS: {
    GET_ALL: createEndpoint(`${API_PATHS.FEE}/sub-plans`),
    GET_BY_ID: (id: string) =>
      createIdEndpoint(`${API_PATHS.FEE}/sub-plans`, id),
    CREATE: createEndpoint(`${API_PATHS.FEE}/sub-plans`),
    UPDATE: (id: string) => createIdEndpoint(`${API_PATHS.FEE}/sub-plans`, id),
    DELETE: (id: string) => createIdEndpoint(`${API_PATHS.FEE}/sub-plans`, id),
  },
  BUSINESS_PLANS: createFeeCategoryEndpoints("business-plans"),
} as const;

export const apiUrls = {
  BASE: BASE_API_URL,
  ...AUTH_ENDPOINTS,
  PROFILE: USER_ENDPOINTS.PROFILE,
  DELETE_ACCOUNT: USER_ENDPOINTS.DELETE_ACCOUNT,
  UPDATE_PROFILE: USER_ENDPOINTS.UPDATE_PROFILE,
  UPDATE_PHONE: USER_ENDPOINTS.UPDATE_PHONE,
  USERS: {
    BASE: AUTH_ENDPOINTS.USERS_BASE,
    BY_ID: USER_ENDPOINTS.GET_USER_BY_ID,
    PROFILE: USER_ENDPOINTS.PROFILE,
    DELETE_ACCOUNT: USER_ENDPOINTS.DELETE_ACCOUNT,
  },
};

export const apiUrlsForCategoryTotals = {
  Cars: CATEGORY_ENDPOINTS.CARS,
  Boats: CATEGORY_ENDPOINTS.BOATS,
  Motorcycles: CATEGORY_ENDPOINTS.MOTORCYCLES,
  RealEstate: CATEGORY_ENDPOINTS.REAL_ESTATE,
  Traktors: CATEGORY_ENDPOINTS.TRAKTOR,
  Marketplace: CATEGORY_ENDPOINTS.MARKETPLACE,
  CarsAdmin: CATEGORY_ENDPOINTS.CARS_ADMIN,
  BoatsAdmin: CATEGORY_ENDPOINTS.BOATS_ADMIN,
  MotorcyclesAdmin: CATEGORY_ENDPOINTS.MOTORCYCLES_ADMIN,
  RealEstateAdmin: CATEGORY_ENDPOINTS.REAL_ESTATE_ADMIN,
  TraktorsAdmin: CATEGORY_ENDPOINTS.TRAKTOR_ADMIN,
  MarketplaceAdmin: CATEGORY_ENDPOINTS.MARKETPLACE_ADMIN,
  allIncludingUnpaid: CATEGORY_ENDPOINTS.MARKETPLACE_ADMIN,
  DeleteItem: CATEGORY_ENDPOINTS.DELETE_ITEM,
  UpdateItem: CATEGORY_ENDPOINTS.UPDATE_ITEM,
  TotalCars: CATEGORY_ENDPOINTS.TOTAL_CARS,
  TotalBoats: CATEGORY_ENDPOINTS.TOTAL_BOATS,
  TotalMotorcycles: CATEGORY_ENDPOINTS.TOTAL_MOTORCYCLES,
  TotalRealEstate: CATEGORY_ENDPOINTS.TOTAL_REAL_ESTATE,
  TotalFarmEquipment: CATEGORY_ENDPOINTS.TOTAL_FARM_EQUIPMENT,
  TotalMarketplace: CATEGORY_ENDPOINTS.TOTAL_MARKETPLACE,
};

export const apiUrlsForFavorites = FAVORITE_ENDPOINTS;
export const apiUrlsForAds = ADS_ENDPOINTS;
export const jobsEndpoint = JOBS_ENDPOINTS;
export const SUBS_ENDPOINTS = SUBSCRIPTION_ENDPOINTS;
export const FAVORITE_ROUTES = FAVORITE_ENDPOINTS;
export const geoEndpoints = GEO_ENDPOINTS;
export const apiUrlsForCharts = {
  GetRegionData: createEndpoint(
    `${API_PATHS.LOCATIONS}/analytics/regions-with-most-item-listings`,
  ),
  GetCityData: createEndpoint(
    `${API_PATHS.LOCATIONS}/analytics/cities-with-most-item-listings`,
  ),
  GetUserSignupData: createEndpoint(
    `${API_PATHS.USERS}/analytics/user-signups-by-month`,
  ),
  GetRevenueData: createEndpoint(
    `${API_PATHS.PAYMENTS}/analytics/revenue-by-month`,
  ),
};
