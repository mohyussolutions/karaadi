"use client";
import React, { useEffect, useState } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, RootState } from "@/store/store";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./ErrorBoundary";
import { hydrateLanguage } from "@/store/slices/reducers/languageSlice";
import Cookies from "js-cookie";

const COOKIE_NAME = "app_lang";

function I18nSync({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const currentLang = useSelector(
    (state: RootState) => state.language.currentLanguage,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cookie = Cookies.get(COOKIE_NAME) as "en" | "so" | undefined;
    const saved = (cookie === "so" || cookie === "en") ? cookie : null;
    if (saved && i18n.language !== saved) {
      dispatch(hydrateLanguage(saved));
      i18n.changeLanguage(saved);
    }
    setHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (hydrated && i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, hydrated]);

  if (!hydrated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

import PersistWrapper from "./PersistWrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistWrapper>
        <I18nSync>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              {children}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
                pauseOnFocusLoss={false}
              />
            </ErrorBoundary>
          </I18nextProvider>
        </I18nSync>
      </PersistWrapper>
    </Provider>
  );
}
