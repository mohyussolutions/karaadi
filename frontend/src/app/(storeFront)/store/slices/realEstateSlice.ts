import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RealEstate, RealEstateState } from "../types/realEstateTypes";

const initialState: RealEstateState = {
  realEstates: [],
};

const realEstateSlice = createSlice({
  name: "realEstates",
  initialState,
  reducers: {
    setRealEstates(state, action: PayloadAction<RealEstate[]>) {
      state.realEstates = action.payload;
    },
    addRealEstate(state, action: PayloadAction<RealEstate>) {
      state.realEstates.push(action.payload);
    },
    updateRealEstate(state, action: PayloadAction<RealEstate>) {
      const idx = state.realEstates.findIndex(
        (r) => r.id === action.payload.id,
      );
      if (idx !== -1) {
        state.realEstates[idx] = {
          ...state.realEstates[idx],
          ...action.payload,
        };
      }
    },
    removeRealEstate(state, action: PayloadAction<string>) {
      state.realEstates = state.realEstates.filter(
        (r) => r.id !== action.payload,
      );
    },
    clearRealEstates(state) {
      state.realEstates = [];
    },
  },
});

export const {
  setRealEstates,
  addRealEstate,
  updateRealEstate,
  removeRealEstate,
  clearRealEstates,
} = realEstateSlice.actions;
export default realEstateSlice.reducer;
