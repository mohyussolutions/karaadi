import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8080";
const REAL_ESTATE_URL = "/api/real-estate";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export type RealEstateUser = {
  _id: string;
  username?: string;
  profileImage?: string;
  phone?: string;
};

export type RealEstateItem = {
  _id: string;
  user: string | RealEstateUser;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  area?: string;
  address?: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  hasGarage?: boolean;
  hasGarden?: boolean;
  mainCategory: string;
};

export type CreateRealEstateItemInput = Omit<RealEstateItem, "_id">;
export type UpdateRealEstateItemInput = Partial<CreateRealEstateItemInput> & {
  id: string;
};

export const realEstateApi = createApi({
  reducerPath: "realEstateApi",
  baseQuery,
  tagTypes: ["RealEstate"],
  endpoints: (builder) => ({
    getRealEstateItems: builder.query<RealEstateItem[], void>({
      query: () => REAL_ESTATE_URL,
      transformResponse: (response: any[]) =>
        response.map((item) => ({
          ...item,
          id: item._id || item.id,
          price: Number(item.price) || 0,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "RealEstate" as const,
                _id,
              })),
              "RealEstate",
            ]
          : ["RealEstate"],
    }),
    getRealEstateItemById: builder.query<RealEstateItem, string>({
      query: (id) => `${REAL_ESTATE_URL}/${id}`,
      transformResponse: (item: any) => ({
        ...item,
        id: item._id || item.id,
        price: Number(item.price) || 0,
      }),
      providesTags: (result, error, id) => [{ type: "RealEstate", id }],
    }),
    createRealEstateItem: builder.mutation<
      RealEstateItem,
      CreateRealEstateItemInput
    >({
      query: (data) => ({
        url: REAL_ESTATE_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RealEstate"],
    }),
    updateRealEstateItem: builder.mutation<
      RealEstateItem,
      UpdateRealEstateItemInput
    >({
      query: ({ id, ...data }) => ({
        url: `${REAL_ESTATE_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "RealEstate", id }],
    }),
    deleteRealEstateItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `${REAL_ESTATE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RealEstate"],
    }),
  }),
});

export const {
  useGetRealEstateItemsQuery,
  useGetRealEstateItemByIdQuery,
  useCreateRealEstateItemMutation,
  useUpdateRealEstateItemMutation,
  useDeleteRealEstateItemMutation,
} = realEstateApi;
