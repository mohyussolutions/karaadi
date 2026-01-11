import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SubscriptionFormState {
  step: number;
  form: {
    userId: string;
    title: string;
    mainCategory: string;
    category: string;
    subCategory: string;
    priceMin: string;
    priceMax: string;
    region: string;
    city: string;
    description: string;
    specificFeatures: string;
    condition: string;
    brand: string;
    model: string;
  };
  createdSubscription: {
    id: string;
    title: string;
  } | null;
  showPayment: boolean;
  paymentMethod: "waafi" | "evc" | "sahal";
  paymentSuccess: boolean;
  loading: boolean;
}

const initialState: SubscriptionFormState = {
  step: 1,
  form: {
    userId: "",
    title: "",
    mainCategory: "",
    category: "",
    subCategory: "",
    priceMin: "",
    priceMax: "",
    region: "",
    city: "",
    description: "",
    specificFeatures: "",
    condition: "",
    brand: "",
    model: "",
  },
  createdSubscription: null,
  showPayment: false,
  paymentMethod: "evc",
  paymentSuccess: false,
  loading: false,
};

const subscriptionFormSlice = createSlice({
  name: "subscriptionForm",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step = Math.max(1, state.step - 1);
    },
    updateForm: (
      state,
      action: PayloadAction<{ field: string; value: string }>
    ) => {
      const { field, value } = action.payload;
      if (field in state.form) {
        const key = field as keyof typeof state.form;
        state.form[key] = value;
      }
    },
    setCreatedSubscription: (
      state,
      action: PayloadAction<{ id: string; title: string } | null>
    ) => {
      state.createdSubscription = action.payload;
    },
    setShowPayment: (state, action: PayloadAction<boolean>) => {
      state.showPayment = action.payload;
    },
    setPaymentMethod: (
      state,
      action: PayloadAction<"waafi" | "evc" | "sahal">
    ) => {
      state.paymentMethod = action.payload;
    },
    setPaymentSuccess: (state, action: PayloadAction<boolean>) => {
      state.paymentSuccess = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  updateForm,
  setCreatedSubscription,
  setShowPayment,
  setPaymentMethod,
  setPaymentSuccess,
  setLoading,
  resetForm,
} = subscriptionFormSlice.actions;

export default subscriptionFormSlice.reducer;
