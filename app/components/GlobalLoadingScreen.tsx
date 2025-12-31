"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { registerLoader } from "./globalLoader";

export default function GlobalLoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    registerLoader(
      (msg?: string) => {
        setMessage(msg);
        setVisible(true);
      },
      () => {
        setVisible(false);
        setMessage(undefined);
      }
    );
  }, []);

  if (!visible) return null;

  return <LoadingScreen message={message} />;
}
