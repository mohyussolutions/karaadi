"use client";

import { PlanState } from "@/app/utils/types/store/planTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PlanState = {
  userSelection: null,
};

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    selectPlan: (state, action: PayloadAction<any>) => {
      state.userSelection = action.payload;
    },
    clearPlan: (state) => {
      state.userSelection = null;
    },
  },
});

export const { selectPlan, clearPlan } = planSlice.actions;

export const selectSelectedPlan = (state: any) => state.plan.userSelection;

export default planSlice.reducer;
