import { useEffect } from "react";
import { useVerifySessionQuery } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { setAuthState } from "@/app/(storeFront)/store/slices/authSlice";

export const useAuthSession = () => {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useVerifySessionQuery();

  useEffect(() => {
    if (data && data.user) {
      dispatch(
        setAuthState({
          user: data.user,
          isAuthenticated: true,
        }),
      );
    }
  }, [data, dispatch]);

  return { isLoading, error };
};
