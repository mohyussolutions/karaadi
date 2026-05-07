import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardSummaryData } from "@/actions/categories/getDashboardSummary";

interface DashboardState {
  data: DashboardSummaryData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: DashboardState = {
  data: null,
  status: "idle",
};

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  async () => {
    const { getDashboardSummary } = await import("@/actions/categories/getDashboardSummary");
    return getDashboardSummary();
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.data = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
