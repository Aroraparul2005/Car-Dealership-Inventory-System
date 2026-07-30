import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);
let seq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (message, tone = "info") => {
      const id = ++seq;
      setToasts((t) => [...t, { id, message, tone }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error"),
      info: (m) => push(m, "info"),
    }),
    [push],
  );

  const tones = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    error: "border-red-500/30 bg-red-500/10 text-red-200",
    info: "border-brand-500/30 bg-brand-500/10 text-brand-100",
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto animate-fade-up rounded-xl border px-4 py-3 text-left text-sm font-medium backdrop-blur ${tones[t.tone]}`}
          >
            {t.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
