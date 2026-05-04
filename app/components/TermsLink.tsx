"use client";

import { FileText } from "lucide-react";
import AnchorWithLoader from "./AnchorWithLoader";

export default function TermsLink({ className }: { className?: string }) {
  return (
    <AnchorWithLoader
      href="/privacyPolicy"
      className={`flex items-center justify-center gap-1.5 text-sm text-gray-900 hover:text-black transition-colors ${className ?? ""}`}
    >
      <FileText className="w-3.5 h-3.5" />
      Términos y Condiciones
    </AnchorWithLoader>
  );
}
