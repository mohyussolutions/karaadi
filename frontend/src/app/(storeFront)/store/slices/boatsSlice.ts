import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8080";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export type User = {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  isAdmin: boolean;
  isManager: boolean;
};

export type Boat = {
  name: string;
  _id: string;
  user: string;
  title: string;
  category: string;
  subCategory: string;
  region: string;
  city: string;
  district: string;
  description: string;
  price: number;
  images: string[];
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
};

export type CreateBoatInput = Omit<Boat, "_id" | "user" | "name"> & {
  user: string;
  name?: string;
  subDistrict?: string;
};

export type UpdateBoatInput = Partial<Omit<Boat, "_id">> & { id: string };

export const boatsApi = createApi({
  reducerPath: "boatsApi",
  baseQuery,
  tagTypes: ["Boat"],
  endpoints: (builder) => ({
    getBoats: builder.query<Boat[], void>({
      query: () => ({
        url: "/api/boats",
        method: "GET",
      }),
      transformResponse: (response: any[]) =>
        response.map((item) => ({
          ...item,
          id: item._id,
        })),
      providesTags: ["Boat"],
      keepUnusedDataFor: 5,
    }),

    getBoatById: builder.query<Boat, string>({
      query: (id) => ({
        url: `/api/boats/${id}`,
        method: "GET",
      }),
      transformResponse: (item: any) => ({
        ...item,
        id: item._id,
      }),
      providesTags: (result, error, id) => [{ type: "Boat", id }],
    }),

    createBoat: builder.mutation<Boat, CreateBoatInput>({
      query: (data) => ({
        url: "/api/boats",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Boat"],
    }),

    deleteBoat: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/boats/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boat"],
    }),

    updateBoat: builder.mutation<Boat, UpdateBoatInput>({
      query: ({ id, ...data }) => ({
        url: `/api/boats/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Boat"],
    }),
  }),
});

export const {
  useGetBoatsQuery,
  useGetBoatByIdQuery,
  useCreateBoatMutation,
  useDeleteBoatMutation,
  useUpdateBoatMutation,
} = boatsApi;
