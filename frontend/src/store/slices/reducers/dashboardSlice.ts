import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardSummaryData, DashboardGeoData } from "@/actions/categories/getDashboardSummary";

interface DashboardState {
  data: DashboardSummaryData | null;
  geo: DashboardGeoData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  geoStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: DashboardState = {
  data: null,
  geo: null,
  status: "idle",
  geoStatus: "idle",
};

export const fetchDashboard = createAsyncThunk("dashboard/fetch", async () => {
  const { getDashboardSummary } = await import("@/actions/categories/getDashboardSummary");
  return getDashboardSummary();
});

export const fetchDashboardGeo = createAsyncThunk("dashboard/fetchGeo", async () => {
  const { getDashboardGeo } = await import("@/actions/categories/getDashboardSummary");
  return getDashboardGeo();
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.data = null;
      state.geo = null;
      state.status = "idle";
      state.geoStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.status = "loading"; })
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.status = "succeeded"; state.data = action.payload; })
      .addCase(fetchDashboard.rejected, (state) => { state.status = "failed"; })
      .addCase(fetchDashboardGeo.pending, (state) => { state.geoStatus = "loading"; })
      .addCase(fetchDashboardGeo.fulfilled, (state, action) => { state.geoStatus = "succeeded"; state.geo = action.payload; })
      .addCase(fetchDashboardGeo.rejected, (state) => { state.geoStatus = "failed"; });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
