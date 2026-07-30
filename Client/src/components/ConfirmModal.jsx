import { useState } from "react";
import Modal from "./Modal";

export default function ConfirmModal({ open, onClose, title, message, confirmLabel, onConfirm }) {
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-slate-300">{message}</p>
      <div className="mt-6 flex gap-2">
        <button className="btn-ghost flex-1" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-danger flex-1" onClick={run} disabled={busy}>
          {busy ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
