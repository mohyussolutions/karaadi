import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8080";
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" });

export type MotoUser = {
  _id: string;
  username?: string;
  profileImage?: string;
  phone?: string;
};

export type Motorcycle = {
  so: string;
  _id: string;
  title: string;
  category: string;
  transmission?: string;
  price: number;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  subCategory: string;
  subCategories: string[];
  user: string | MotoUser;
  images: string[];
  type: string;
  make: string;
  modelName: string;
  year: number;
  mileage: number;
  engineSize: string;
  fuelType: string;
  color: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateMotorcycleInput = Omit<
  Motorcycle,
  "_id" | "createdAt" | "updatedAt"
> & { user: string };
type UpdateMotorcycleInput = Partial<CreateMotorcycleInput> & { _id: string };

export const motorcyclesApi = createApi({
  reducerPath: "motorcyclesApi",
  baseQuery,
  tagTypes: ["Motorcycle"],
  endpoints: (builder) => ({
    getMotorcycles: builder.query<Motorcycle[], void>({
      query: () => "/api/motorcycles",
      providesTags: ["Motorcycle"],
    }),
    getMotorcycleById: builder.query<Motorcycle, string>({
      query: (id) => `/api/motorcycles/${id}`,
      providesTags: (result, error, id) => [{ type: "Motorcycle", id }],
    }),
    createMotorcycle: builder.mutation<Motorcycle, CreateMotorcycleInput>({
      query: (data) => ({
        url: "/api/motorcycles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Motorcycle"],
    }),
    updateMotorcycle: builder.mutation<Motorcycle, UpdateMotorcycleInput>({
      query: ({ _id, ...data }) => ({
        url: `/api/motorcycles/${_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Motorcycle"],
    }),
    deleteMotorcycle: builder.mutation<
      { success: boolean; _id: string },
      string
    >({
      query: (_id) => ({ url: `/api/motorcycles/${_id}`, method: "DELETE" }),
      invalidatesTags: ["Motorcycle"],
    }),
  }),
});

export const {
  useGetMotorcyclesQuery,
  useGetMotorcycleByIdQuery,
  useCreateMotorcycleMutation,
  useUpdateMotorcycleMutation,
  useDeleteMotorcycleMutation,
} = motorcyclesApi;
