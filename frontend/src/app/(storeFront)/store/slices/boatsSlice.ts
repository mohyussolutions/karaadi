import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Boat, BoatsState } from "@/app/utils/types/store/boatTypes";

const initialState: BoatsState = {
  boats: [],
  userSelection: null,
};

const boatsSlice = createSlice({
  name: "boats",
  initialState,
  reducers: {
    setBoats(state, action: PayloadAction<Boat[]>) {
      state.boats = action.payload;
    },
    addBoat(state, action: PayloadAction<Boat>) {
      state.boats.push(action.payload);
      state.userSelection = action.payload;
    },
    updateBoat(state, action: PayloadAction<Boat>) {
      const idx = state.boats.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) {
        state.boats[idx] = { ...state.boats[idx], ...action.payload };
      }
      if (state.userSelection?.id === action.payload.id) {
        state.userSelection = { ...state.userSelection, ...action.payload };
      }
    },
    removeBoat(state, action: PayloadAction<string>) {
      state.boats = state.boats.filter((boat) => boat.id !== action.payload);
      if (state.userSelection?.id === action.payload) {
        state.userSelection = null;
      }
    },
    clearBoats(state) {
      state.boats = [];
      state.userSelection = null;
    },
  },
});

export const { setBoats, addBoat, updateBoat, removeBoat, clearBoats } =
  boatsSlice.actions;
export const selectActiveBoat = (state: any) => state.boats.userSelection;
export default boatsSlice.reducer;
