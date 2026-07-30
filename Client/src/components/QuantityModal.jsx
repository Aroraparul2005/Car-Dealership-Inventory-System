import { useEffect, useState } from "react";
import Modal from "./Modal";
import { currency, FALLBACK_IMAGE } from "../lib/format";

/**
 * Shared quantity dialog used for both purchase and restock.
 * mode: "purchase" | "restock"
 */
export default function QuantityModal({ open, onClose, vehicle, mode, onConfirm }) {
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setQty(1);
      setBusy(false);
    }
  }, [open, vehicle]);

  if (!vehicle) return null;

  const purchasing = mode === "purchase";
  const stock = Number(vehicle.quantity) || 0;
  const n = Number(qty);
  const invalid = !Number.isFinite(n) || n <= 0 || (purchasing && n > stock);

  const submit = async (e) => {
    e.preventDefault();
    if (invalid) return;
    setBusy(true);
    try {
      await onConfirm(vehicle, n);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={purchasing ? "Confirm purchase" : "Restock vehicle"}
      subtitle={`${vehicle.make} ${vehicle.model}`}
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="flex gap-4">
          <img
            src={vehicle.image || FALLBACK_IMAGE}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-24 w-32 shrink-0 rounded-xl border border-white/10 object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div className="text-sm">
            <p className="text-2xl font-bold text-brand-500">{currency(vehicle.price)}</p>
            <p className="mt-1 text-slate-400">In stock: {stock}</p>
            <p className="text-slate-400 capitalize">Category: {vehicle.category}</p>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="q-qty">Quantity</label>
          <input
            id="q-qty"
            type="number"
            min="1"
            max={purchasing ? stock : undefined}
            className="input"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          {purchasing && n > stock && (
            <p className="mt-1 text-xs text-red-400">Not available — only {stock} in stock.</p>
          )}
        </div>

        {purchasing && (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.03] px-4 py-3">
            <span className="text-xs uppercase tracking-widest text-slate-400">Total</span>
            <span className="text-xl font-bold text-white">
              {currency((Number(vehicle.price) || 0) * (invalid ? 0 : n))}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button type="button" className="btn-ghost flex-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={invalid || busy}>
            {busy ? "Processing…" : purchasing ? "Buy now" : "Add stock"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
