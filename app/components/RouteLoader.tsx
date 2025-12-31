"use client";

import { useLoading } from "./LoadingContext";
import LoadingScreen from "./LoadingScreen";

export default function RouteLoader() {
  const { loading, message } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <LoadingScreen message={message} />
    </div>
  );
}
