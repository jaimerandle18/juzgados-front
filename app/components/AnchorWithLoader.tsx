"use client";

import { showLoader } from "./globalLoader";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  loadingMessage?: string;
};

export default function AnchorWithLoader({
  loadingMessage,
  onClick,
  ...props
}: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        showLoader(loadingMessage);
        onClick?.(e);
      }}
    />
  );
}
