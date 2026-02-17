import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Car, CarsState } from "@/app/utils/types/store/carTypes";

const initialState: CarsState = {
  cars: [],
  userSelection: null,
};

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<Car[]>) {
      state.cars = action.payload;
    },
    addCar(state, action: PayloadAction<Car>) {
      state.cars.push(action.payload);
      state.userSelection = action.payload;
    },
    updateCar(state, action: PayloadAction<Car>) {
      const idx = state.cars.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.cars[idx] = { ...state.cars[idx], ...action.payload };
      }
      if (state.userSelection?.id === action.payload.id) {
        state.userSelection = { ...state.userSelection, ...action.payload };
      }
    },
    removeCar(state, action: PayloadAction<string>) {
      state.cars = state.cars.filter((car) => car.id !== action.payload);
      if (state.userSelection?.id === action.payload) {
        state.userSelection = null;
      }
    },
    clearCars(state) {
      state.cars = [];
      state.userSelection = null;
    },
  },
});

export const { setCars, addCar, updateCar, removeCar, clearCars } =
  carsSlice.actions;

export const selectActiveCar = (state: any) => state.cars.userSelection;

export default carsSlice.reducer;
