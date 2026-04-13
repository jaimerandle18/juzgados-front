"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";
import { hapticSuccess, hapticError, hapticLight } from "../utils/haptics";

type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastContextType = {
  showToast: (message: string, kind?: ToastKind) => void;
  toastSuccess: (message: string) => void;
  toastError: (message: string) => void;
  toastInfo: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const DURATION = 3200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setItems((arr) => arr.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = ++idRef.current;
      setItems((arr) => [...arr, { id, message, kind }]);

      if (kind === "success") hapticSuccess();
      else if (kind === "error") hapticError();
      else hapticLight();

      setTimeout(() => remove(id), DURATION);
    },
    [remove]
  );

  const api: ToastContextType = {
    showToast,
    toastSuccess: (m) => showToast(m, "success"),
    toastError: (m) => showToast(m, "error"),
    toastInfo: (m) => showToast(m, "info"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer items={items} onDismiss={remove} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      className="fixed left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 5.5rem)",
        zIndex: 9_999_998,
      }}
    >
      <AnimatePresence initial={false}>
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={() => onDismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const [Icon, color] =
    item.kind === "success"
      ? [CheckCircle2, "text-white bg-green-500"]
      : item.kind === "error"
      ? [XCircle, "text-white bg-red-500"]
      : [Info, "text-white bg-blue-500"];

  return (
    <motion.button
      type="button"
      onClick={onDismiss}
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`
        pointer-events-auto
        max-w-md mx-4 px-4 py-3 rounded-2xl
        shadow-xl backdrop-blur-lg
        flex items-center gap-3
        ${color}
      `}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="font-semibold text-sm leading-tight text-left">
        {item.message}
      </p>
    </motion.button>
  );
}

/* ---------- Hook helper para componentes no-hijos (raro, pero útil) ---------- */
/**
 * Permite usar toasts sin leer el context: pedís la fn una vez al montar.
 * (Solo funciona si el provider ya está en el árbol.)
 */
export function useToastMountEffect(fn: (t: ToastContextType) => void) {
  const toast = useToast();
  useEffect(() => {
    fn(toast);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
