import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tractor } from "@/app/utils/types/store/traktorTypes";

interface TraktorsState {
  traktors: Tractor[];
}

const initialState: TraktorsState = {
  traktors: [],
};

const traktorsSlice = createSlice({
  name: "traktors",
  initialState,
  reducers: {
    addTraktor(state, action: PayloadAction<Tractor>) {
      state.traktors.push(action.payload);
    },
    setTraktors(state, action: PayloadAction<Tractor[]>) {
      state.traktors = action.payload;
    },
    removeTraktor(state, action: PayloadAction<string>) {
      state.traktors = state.traktors.filter((t) => t.id !== action.payload);
    },
    updateTraktor(state, action: PayloadAction<Tractor>) {
      const idx = state.traktors.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.traktors[idx] = { ...state.traktors[idx], ...action.payload };
      }
    },
  },
});

export const { addTraktor, setTraktors, removeTraktor, updateTraktor } =
  traktorsSlice.actions;
export default traktorsSlice.reducer;
