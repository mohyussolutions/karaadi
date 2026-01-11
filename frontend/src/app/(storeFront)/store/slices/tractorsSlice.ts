import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8080";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export type TractorUser = {
  _id: string;
  username?: string;
  profileImage?: string;
  phone?: string;
};

export type Tractor = {
  _id: string;
  title: string;
  user: string | TractorUser;
  id: string;
  description: string[] | string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  images: string[];
  subCategories: string;
  so?: string;
  type: string | boolean;
  make: string;
  equipmentModel: string;
  year: number;
  condition: string;
  hours: number;
  enginePower: string;
  fuelType: string;
  transmissionType?: string;
  extra?: Record<string, any>;
};

export type CreateTractorInput = Omit<
  Tractor,
  "_id" | "id" | "createdAt" | "updatedAt"
>;
export type UpdateTractorInput = Partial<Omit<Tractor, "id">> & { id: string };

export const tractorsApi = createApi({
  reducerPath: "tractorsApi",
  baseQuery,
  tagTypes: ["Tractor"],
  endpoints: (builder) => ({
    getTractors: builder.query<Tractor[], void>({
      query: () => ({
        url: "/api/traktor",
        method: "GET",
      }),
      transformResponse: (response: any[]) =>
        response.map((item) => ({
          ...item,
          id: item._id,
        })),
      providesTags: ["Tractor"],
      keepUnusedDataFor: 5,
    }),

    getTractorById: builder.query<Tractor, string>({
      query: (id) => ({
        url: `/api/traktor/${id}`,
        method: "GET",
      }),
      transformResponse: (item: any) => ({
        ...item,
        id: item._id,
      }),
      providesTags: (result, error, id) => [{ type: "Tractor", id }],
    }),

    createTractor: builder.mutation<Tractor, CreateTractorInput>({
      query: (data) => ({
        url: "/api/traktor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tractor"],
    }),

    deleteTractor: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/traktor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tractor"],
    }),

    updateTractor: builder.mutation<Tractor, UpdateTractorInput>({
      query: ({ id, ...data }) => ({
        url: `/api/traktor/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tractor"],
    }),
  }),
});

export const {
  useGetTractorsQuery,
  useGetTractorByIdQuery,
  useCreateTractorMutation,
  useDeleteTractorMutation,
  useUpdateTractorMutation,
} = tractorsApi;
