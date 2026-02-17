import {
  Motorcycle,
  MotorcyclesState,
} from "@/app/utils/types/store/motorcycleTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MotorcyclesState = {
  motorcycles: [],
};

const motorcyclesSlice = createSlice({
  name: "motorcycles",
  initialState,
  reducers: {
    setMotorcycles(state, action: PayloadAction<Motorcycle[]>) {
      state.motorcycles = action.payload;
    },
    addMotorcycle(state, action: PayloadAction<Motorcycle>) {
      state.motorcycles.push(action.payload);
    },
    updateMotorcycle(state, action: PayloadAction<Motorcycle>) {
      const idx = state.motorcycles.findIndex(
        (m) => m.id === action.payload.id,
      );
      if (idx !== -1) {
        state.motorcycles[idx] = {
          ...state.motorcycles[idx],
          ...action.payload,
        };
      }
    },
    removeMotorcycle(state, action: PayloadAction<string>) {
      state.motorcycles = state.motorcycles.filter(
        (m) => m.id !== action.payload,
      );
    },
    clearMotorcycles(state) {
      state.motorcycles = [];
    },
  },
});

export const {
  setMotorcycles,
  addMotorcycle,
  updateMotorcycle,
  removeMotorcycle,
  clearMotorcycles,
} = motorcyclesSlice.actions;
export default motorcyclesSlice.reducer;
