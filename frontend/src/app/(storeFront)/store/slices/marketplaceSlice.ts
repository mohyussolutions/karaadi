import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReactNode } from "react";

const BASE_URL = "http://localhost:8080";
const REAL_ESTATE_URL = "/api/marketplace";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

// Resolve invalid image keys (e.g., "unsplash_...") to a safe placeholder
// to avoid Next Image requesting non-existent localhost paths.
// Keeps http/https, absolute "/", and data URLs intact.
// Unknown tokens map to placehold.co which is allowed in next.config.
const resolveImages = (images?: string[]): string[] =>
  (Array.isArray(images) ? images : [])
    .map((src) => {
      if (!src) return "https://placehold.co/600x400?text=No+Image";
      if (
        src.startsWith("http") ||
        src.startsWith("/") ||
        src.startsWith("data:image")
      ) {
        return src;
      }
      const label = encodeURIComponent(src.toString());
      return `https://placehold.co/600x400?text=${label}`;
    })
    .filter((s) => typeof s === "string" && s.length > 0);

export type RealEstateItem = {
  icon: ReactNode;
  so: string;
  id: string;
  user: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  images: string[];
  extra?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  maGaday: boolean;
};

export type CreateRealEstateItemInput = Omit<
  RealEstateItem,
  "id" | "user" | "images" | "createdAt" | "updatedAt" | "icon" | "so"
>;

export type UpdateRealEstateItemInput = Partial<
  Omit<RealEstateItem, "_id" | "createdAt" | "updatedAt">
> & { _id: string };

export const marketplaceApi = createApi({
  reducerPath: "marketplaceApi",
  baseQuery,
  tagTypes: ["Marketplace"],
  endpoints: (builder) => ({
    getMarketplaceItems: builder.query<RealEstateItem[], void>({
      query: () => REAL_ESTATE_URL,
      transformResponse: (response: any[]) =>
        response.map((item) => ({
          ...item,
          _id: item._id, // ensure _id exists
          maGaday: item.maGaday || false, // default value
          images: resolveImages(item.images),
        })),
      providesTags: ["Marketplace"],
    }),
    getMarketplaceItemById: builder.query<RealEstateItem, string>({
      query: (id) => `${REAL_ESTATE_URL}/${id}`,
      transformResponse: (item: any) => ({
        ...item,
        _id: item._id,
        maGaday: item.maGaday || false, // default value
        images: resolveImages(item.images),
      }),
      providesTags: (result, error, id) => [{ type: "Marketplace", id }],
    }),
    createMarketplaceItem: builder.mutation<
      RealEstateItem,
      CreateRealEstateItemInput
    >({
      query: (data) => ({
        url: REAL_ESTATE_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Marketplace"],
    }),
    updateMarketplaceItem: builder.mutation<
      RealEstateItem,
      UpdateRealEstateItemInput
    >({
      query: ({ _id, ...data }) => ({
        url: `${REAL_ESTATE_URL}/${_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Marketplace"],
    }),
    deleteMarketplaceItem: builder.mutation<
      { success: boolean; _id: string },
      string
    >({
      query: (_id) => ({
        url: `${REAL_ESTATE_URL}/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Marketplace"],
    }),
  }),
});

export const {
  useGetMarketplaceItemsQuery,
  useGetMarketplaceItemByIdQuery,
  useCreateMarketplaceItemMutation,
  useDeleteMarketplaceItemMutation,
  useUpdateMarketplaceItemMutation,
} = marketplaceApi;
