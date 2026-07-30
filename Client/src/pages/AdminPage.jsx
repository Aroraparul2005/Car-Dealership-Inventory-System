import { useState } from "react";
import useVehicles from "../hooks/useVehicles";
import { useToast } from "../context/ToastContext";
import { vehiclesApi } from "../api/client";
import { currency, FALLBACK_IMAGE } from "../lib/format";
import VehicleFilters from "../components/VehicleFilters";
import VehicleFormModal from "../components/VehicleFormModal";
import QuantityModal from "../components/QuantityModal";
import ConfirmModal from "../components/ConfirmModal";
import { EmptyState, Pagination } from "../components/ui";

function Stat({ label, value }) {
  return (
    <div className="card px-5 py-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="display mt-1 text-3xl text-white">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const toast = useToast();
  const {
    filters,
    updateFilters,
    reset,
    page,
    setPage,
    vehicles,
    pagination,
    loading,
    error,
    refresh,
    patchVehicle,
  } = useVehicles();

  const [formModal, setFormModal] = useState({ open: false, vehicle: null });
  const [qtyModal, setQtyModal] = useState({ open: false, vehicle: null });
  const [confirm, setConfirm] = useState({ open: false, vehicle: null });

  const stockValue = vehicles.reduce(
    (sum, v) => sum + (Number(v.price) || 0) * (Number(v.quantity) || 0),
    0,
  );
  const outOfStock = vehicles.filter((v) => Number(v.quantity) <= 0).length;

  const handleRestock = async (vehicle, quantity) => {
    try {
      const res = await vehiclesApi.restock(vehicle._id, quantity);
      if (res?.vehicle) patchVehicle(res.vehicle);
      toast.success(res?.message || "Restock successful");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await vehiclesApi.remove(confirm.vehicle._id);
      toast.success(res?.message || "Vehicle deleted successfully");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chip border-brand-500/30 bg-brand-500/10 text-brand-300">Admin</p>
          <h1 className="mt-3 text-5xl leading-none text-white">Inventory control</h1>
          <p className="mt-3 text-slate-400">Add, update, restock and remove vehicles.</p>
        </div>
        <button className="btn-primary" onClick={() => setFormModal({ open: true, vehicle: null })}>
          Add vehicle
        </button>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Vehicles (total)" value={pagination.total} />
        <Stat label="Stock value (page)" value={currency(stockValue)} />
        <Stat label="Out of stock (page)" value={outOfStock} />
      </div>

      <VehicleFilters
        filters={filters}
        onChange={updateFilters}
        onReset={reset}
        resultCount={loading ? null : pagination.total}
      />

      <section className="card mt-8 overflow-hidden">
        {error ? (
          <div className="p-6">
            <p className="text-sm text-red-300">{error}</p>
            <button className="btn-ghost mt-4" onClick={refresh}>
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-ink-800" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyState title="Nothing here" message="No vehicles match the current filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/5 text-xs uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vehicles.map((v) => (
                  <tr key={v._id} className="transition hover:bg-white/[.03]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.image || FALLBACK_IMAGE}
                          alt={`${v.make} ${v.model}`}
                          className="h-11 w-16 rounded-lg border border-white/10 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div>
                          <p className="font-semibold text-white">{v.make}</p>
                          <p className="text-xs text-slate-400">{v.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize text-slate-300">{v.category}</td>
                    <td className="px-5 py-3 font-semibold text-brand-500">{currency(v.price)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          Number(v.quantity) <= 0
                            ? "chip border-red-500/30 bg-red-500/10 text-red-300"
                            : "chip"
                        }
                      >
                        {v.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-ghost px-3 py-1.5"
                          onClick={() => setQtyModal({ open: true, vehicle: v })}
                        >
                          Restock
                        </button>
                        <button
                          className="btn-ghost px-3 py-1.5"
                          onClick={() => setFormModal({ open: true, vehicle: v })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger px-3 py-1.5"
                          onClick={() => setConfirm({ open: true, vehicle: v })}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-8">
        <Pagination page={pagination.page || page} totalPages={pagination.totalPages} onPage={setPage} />
      </div>

      <VehicleFormModal
        open={formModal.open}
        vehicle={formModal.vehicle}
        onClose={() => setFormModal({ open: false, vehicle: null })}
        onSaved={refresh}
      />

      <QuantityModal
        open={qtyModal.open}
        vehicle={qtyModal.vehicle}
        mode="restock"
        onClose={() => setQtyModal({ open: false, vehicle: null })}
        onConfirm={handleRestock}
      />

      <ConfirmModal
        open={confirm.open}
        title="Delete vehicle"
        message={`Permanently remove ${confirm.vehicle?.make ?? ""} ${confirm.vehicle?.model ?? ""}? This cannot be undone.`}
        confirmLabel="Delete"
        onClose={() => setConfirm({ open: false, vehicle: null })}
        onConfirm={handleDelete}
      />
    </main>
  );
}
