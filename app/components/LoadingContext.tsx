"use client";

import { createContext, useContext, useState } from "react";

type LoadingContextType = {
  loading: boolean;
  message?: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showLoader = (msg?: string) => {
    setMessage(msg);
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
    setMessage(undefined);
  };

  return (
    <LoadingContext.Provider
      value={{ loading, message, showLoader, hideLoader }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading debe usarse dentro de <LoadingProvider>");
  }
  return ctx;
}
