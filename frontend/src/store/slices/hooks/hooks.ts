import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { Store } from "redux";

export type AppStore = Store<RootState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
