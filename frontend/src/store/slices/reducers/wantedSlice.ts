import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export interface WantedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  category: string;
  title: string;
  details: string;
  location: string;
  maxBudget: number;
  expiresAt: string;
  createdAt: string;
  active: boolean;
}

export interface WantedState {
  items: WantedPost[];
  myPosts: WantedPost[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WantedState = {
  items: [],
  myPosts: [],
  status: "idle",
  error: null,
};

export const fetchWantedPosts = createAsyncThunk(
  "wanted/fetchAll",
  async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/api/wanted`, {
      headers: headers as HeadersInit,
    });
    if (!res.ok) throw new Error("Failed to fetch wanted posts");
    return res.json();
  },
);

export const fetchMyWantedPosts = createAsyncThunk(
  "wanted/fetchMy",
  async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/api/wanted/my`, {
      headers: headers as HeadersInit,
    });
    if (!res.ok) throw new Error("Failed to fetch my wanted posts");
    return res.json();
  },
);

export const createWantedPost = createAsyncThunk(
  "wanted/create",
  async (data: Partial<WantedPost>) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/api/wanted`, {
      method: "POST",
      headers: {
        ...(headers as Record<string, string>),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create wanted post");
    return res.json();
  },
);

export const respondToWantedPost = createAsyncThunk(
  "wanted/respond",
  async (id: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/api/wanted/${id}/respond`, {
      method: "POST",
      headers: headers as HeadersInit,
    });
    if (!res.ok) throw new Error("Failed to respond to wanted post");
    return res.json();
  },
);

const wantedSlice = createSlice({
  name: "wanted",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWantedPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWantedPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWantedPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(fetchMyWantedPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload;
      })
      .addCase(createWantedPost.fulfilled, (state, action) => {
        state.myPosts.unshift(action.payload);
      });
  },
});

export default wantedSlice.reducer;
