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

export interface ICar {
  so: string;
  _id?: string;
  user: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  listingType: string;
  brand: string;
  vehicleModel: string;
  year?: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  color: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  images: string[];
  area?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateCarInput = Omit<ICar, "_id">;
export type UpdateCarInput = Partial<Omit<ICar, "_id">> & { _id: string };

export const carsApi = createApi({
  reducerPath: "carsApi",
  baseQuery,
  tagTypes: ["Car"],
  endpoints: (builder) => ({
    getCars: builder.query<ICar[], void>({
      query: () => ({ url: "/api/cars", method: "GET" }),
      transformResponse: (response: any[]) =>
        (response || [])
          .filter((item) => item)
          .map((item) => ({
            ...item,
            _id: item._id || "",
            user:
              typeof item.user === "string" ? item.user : item.user?._id || "",
          })),
      providesTags: ["Car"],
      keepUnusedDataFor: 5,
    }),
    getCarById: builder.query<ICar, string>({
      query: (id) => ({ url: `/api/cars/${id}`, method: "GET" }),
      transformResponse: (item: any) => {
        if (!item) return {} as ICar;
        return {
          ...item,
          _id: item._id || "",
          user:
            typeof item.user === "string" ? item.user : item.user?._id || "",
        };
      },
      providesTags: (result, error, id) => [{ type: "Car", id }],
    }),
    createCar: builder.mutation<ICar, CreateCarInput>({
      query: (data) => ({
        url: "/api/cars",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),
    deleteCar: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({ url: `/api/cars/${id}`, method: "DELETE" }),
      invalidatesTags: ["Car"],
    }),
    updateCar: builder.mutation<ICar, UpdateCarInput>({
      query: ({ _id, ...data }) => ({
        url: `/api/cars/${_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useDeleteCarMutation,
  useUpdateCarMutation,
} = carsApi;
