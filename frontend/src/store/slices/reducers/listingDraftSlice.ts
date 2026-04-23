const MAX_STEP = 4;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ListingItem {
  [key: string]: any;
}

interface PlanDetails {
  id: string;
  label: string;
  price: number;
  days: number;
  features: string[];
  [key: string]: any;
}

export interface SellFlowState {
  currentStep: number;
  item: ListingItem;
  items: ListingItem[];
  plan: PlanDetails | null;
  ownerId: string | null;
}

const initialState: SellFlowState = {
  currentStep: 1,
  item: {},
  items: [],
  plan: null,
  ownerId: null,
};

const sellFlowSlice = createSlice({
  name: "sellFlow",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < MAX_STEP) state.currentStep += 1;
    },
    previousStep: (state) => {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateItem: (state, action: PayloadAction<Partial<ListingItem>>) => {
      if (!Array.isArray(state.items)) state.items = [];
      state.item = { ...state.item, ...action.payload };
      const id = state.item.id;
      if (id) {
        const idx = state.items.findIndex((i) => i.id === id);
        if (idx >= 0) {
          state.items[idx] = { ...state.item };
        } else {
          state.items.push({ ...state.item });
        }
      }
    },
    setActiveItem: (state, action: PayloadAction<ListingItem>) => {
      state.item = action.payload;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      if (!Array.isArray(state.items)) state.items = [];
      state.items = state.items.filter((i) => i.id !== action.payload);
      if (state.item.id === action.payload) {
        state.item = state.items[0] ?? {};
      }
    },
    setPlan: (state, action: PayloadAction<PlanDetails>) => {
      state.plan = action.payload;
    },
    setOwnerId: (state, action: PayloadAction<string | null>) => {
      state.ownerId = action.payload;
    },
    resetFlow: () => initialState,
    clearDraft: (state) => {
      if (!Array.isArray(state.items)) state.items = [];
      const activeId = state.item.id;
      state.items = state.items.filter((i) => i.id !== activeId);
      state.item = state.items[0] ?? {};
      state.plan = null;
      state.currentStep = 1;
    },
  },
});

export const {
  setCurrentStep,
  updateItem,
  setActiveItem,
  removeItem,
  setPlan,
  setOwnerId,
  nextStep,
  previousStep,
  resetFlow,
  clearDraft,
} = sellFlowSlice.actions;

export default sellFlowSlice.reducer;
