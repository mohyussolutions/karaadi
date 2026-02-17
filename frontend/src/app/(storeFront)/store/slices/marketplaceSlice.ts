import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MarketplaceItem {
  id: string;
  name: string;
}

interface MarketplaceState {
  items: MarketplaceItem[];
}

const initialState: MarketplaceState = {
  items: [],
};

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    setMarketplaceItems(state, action: PayloadAction<MarketplaceItem[]>) {
      state.items = action.payload;
    },
    addMarketplaceItem(state, action: PayloadAction<MarketplaceItem>) {
      state.items.push(action.payload);
    },
    removeMarketplaceItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const {
  setMarketplaceItems,
  addMarketplaceItem,
  removeMarketplaceItem,
} = marketplaceSlice.actions;
export default marketplaceSlice.reducer;
