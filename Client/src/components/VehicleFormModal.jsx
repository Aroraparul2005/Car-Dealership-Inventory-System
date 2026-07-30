import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import { CATEGORIES } from "../lib/format";
import { vehiclesApi } from "../api/client";
import { useToast } from "../context/ToastContext";

const EMPTY = { make: "", model: "", category: "car", price: "", quantity: "1" };

/**
 * Create  -> POST /api/vehicles  (multipart/form-data, `image` file required)
 * Update  -> PUT  /api/vehicles/:id (JSON body; the API does not accept a new file here)
 */
export default function VehicleFormModal({ open, onClose, vehicle, onSaved }) {
  const editing = Boolean(vehicle);
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setFile(null);
    setPreview(null);
    setForm(
      vehicle
        ? {
            make: vehicle.make ?? "",
            model: vehicle.model ?? "",
            category: vehicle.category ?? "car",
            price: String(vehicle.price ?? ""),
            quantity: String(vehicle.quantity ?? 0),
          }
        : EMPTY,
    );
  }, [open, vehicle]);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.make.trim()) e.make = "Make is required";
    if (!form.model.trim()) e.model = "Model is required";
    if (!CATEGORIES.includes(form.category)) e.category = "Pick a valid category";
    if (form.price === "" || Number(form.price) <= 0) e.price = "Price must be greater than 0";
    if (form.quantity !== "" && Number(form.quantity) < 0) e.quantity = "Quantity cannot be negative";
    if (!editing && !file) e.image = "Image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        const saved = await vehiclesApi.update(vehicle._id, {
          make: form.make.trim(),
          model: form.model.trim(),
          category: form.category,
          price: Number(form.price),
          quantity: Number(form.quantity || 0),
        });
        toast.success(`${saved.make} ${saved.model} updated`);
      } else {
        const fd = new FormData();
        fd.append("make", form.make.trim());
        fd.append("model", form.model.trim());
        fd.append("category", form.category);
        fd.append("price", String(Number(form.price)));
        fd.append("quantity", String(Number(form.quantity || 0)));
        fd.append("image", file);
        const created = await vehiclesApi.create(fd);
        toast.success(`${created.make} ${created.model} added to inventory`);
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const imgSrc = useMemo(() => preview || vehicle?.image || null, [preview, vehicle]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={editing ? "Edit vehicle" : "Add vehicle"}
      subtitle={
        editing
          ? "Image changes are not supported by the update endpoint."
          : "All fields are required, including the image."
      }
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="v-make">Make</label>
          <input id="v-make" className="input" value={form.make} onChange={set("make")} placeholder="Toyota" />
          {errors.make && <p className="mt-1 text-xs text-red-400">{errors.make}</p>}
        </div>

        <div>
          <label className="label" htmlFor="v-model">Model</label>
          <input id="v-model" className="input" value={form.model} onChange={set("model")} placeholder="Corolla" />
          {errors.model && <p className="mt-1 text-xs text-red-400">{errors.model}</p>}
        </div>

        <div>
          <label className="label" htmlFor="v-cat">Category</label>
          <select id="v-cat" className="input" value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="v-price">Price (USD)</label>
          <input id="v-price" type="number" min="1" className="input" value={form.price} onChange={set("price")} placeholder="24000" />
          {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
        </div>

        <div>
          <label className="label" htmlFor="v-qty">Quantity</label>
          <input id="v-qty" type="number" min="0" className="input" value={form.quantity} onChange={set("quantity")} />
          {errors.quantity && <p className="mt-1 text-xs text-red-400">{errors.quantity}</p>}
        </div>

        {!editing && (
          <div>
            <label className="label" htmlFor="v-img">Image</label>
            <input
              id="v-img"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-ink-950"
            />
            {errors.image && <p className="mt-1 text-xs text-red-400">{errors.image}</p>}
          </div>
        )}

        {imgSrc && (
          <div className="sm:col-span-2">
            <img
              src={imgSrc}
              alt="Vehicle preview"
              className="h-44 w-full rounded-xl border border-white/10 object-cover"
            />
          </div>
        )}

        <div className="mt-2 flex gap-2 sm:col-span-2">
          <button type="button" className="btn-ghost flex-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Add vehicle"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
