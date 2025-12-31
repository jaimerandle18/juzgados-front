"use client";

import { useHrefLoader } from "@/components/useHrefLoader";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function AnchorWithLoader(props: Props) {
  const { onClick } = useHrefLoader();

  return <a {...props} onClick={onClick} />;
}
