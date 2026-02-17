import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeeItem {
  id: string;
  query: string;
  fee: {
    totalAmount: number;
    currency: string;
  };
}

const initialState: FeeItem[] = [];

const feesSlice = createSlice({
  name: "fees",
  initialState,
  reducers: {
    addFee: (state, action: PayloadAction<FeeItem>) => {
      state.push(action.payload);
    },
    removeFee: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },
    clearFees: () => {
      return [];
    },
  },
});

export const { addFee, removeFee, clearFees } = feesSlice.actions;
export default feesSlice.reducer;
