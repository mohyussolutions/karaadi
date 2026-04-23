import { createTransform } from "redux-persist";
import type { SellFlowState } from "./slices/reducers/listingDraftSlice";

const listingDraftTransform = createTransform<SellFlowState, Partial<SellFlowState>>(
  (inboundState, key) => {
    if (key === "listingDraft") {
      const { currentStep, plan, ownerId, items, item } = inboundState;
      const stripImages = (i: any) => ({ ...i, images: [] });
      return {
        currentStep,
        plan,
        ownerId,
        items: Array.isArray(items) ? items.map(stripImages) : [],
        item: item && Object.keys(item).length > 0 ? stripImages(item) : {},
      };
    }
    return inboundState;
  },
  (outboundState) => outboundState as SellFlowState,
);

export default listingDraftTransform;
