import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useVehicles from "../hooks/useVehicles";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { vehiclesApi } from "../api/client";
import VehicleCard from "../components/VehicleCard";
import VehicleFilters from "../components/VehicleFilters";
import VehicleFormModal from "../components/VehicleFormModal";
import QuantityModal from "../components/QuantityModal";
import ConfirmModal from "../components/ConfirmModal";
import { CardSkeleton, EmptyState, Pagination } from "../components/ui";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
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

  const [qtyModal, setQtyModal] = useState({ open: false, vehicle: null, mode: "purchase" });
  const [formModal, setFormModal] = useState({ open: false, vehicle: null });
  const [confirm, setConfirm] = useState({ open: false, vehicle: null });

  const requireAuth = () => {
    if (user) return true;
    toast.info("Please log in to continue");
    navigate("/login", { state: { from: "/" } });
    return false;
  };

  const openPurchase = (vehicle) => {
    if (!requireAuth()) return;
    setQtyModal({ open: true, vehicle, mode: "purchase" });
  };

  const openRestock = (vehicle) => setQtyModal({ open: true, vehicle, mode: "restock" });

  const handleQuantity = async (vehicle, quantity) => {
    try {
      const res =
        qtyModal.mode === "purchase"
          ? await vehiclesApi.purchase(vehicle._id, quantity)
          : await vehiclesApi.restock(vehicle._id, quantity);
      if (res?.vehicle) patchVehicle(res.vehicle);
      toast.success(res?.message || "Done");
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
          <p className="chip">Live inventory</p>
          <h1 className="mt-3 text-5xl leading-none text-white sm:text-6xl">
            Find your next <span className="text-brand-500">ride</span>
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            {user
              ? `Signed in as ${user.name}. Browse the fleet and buy in one click.`
              : "Browse the fleet — log in when you're ready to purchase."}
          </p>
        </div>

        {isAdmin && (
          <button className="btn-primary" onClick={() => setFormModal({ open: true, vehicle: null })}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add vehicle
          </button>
        )}
      </section>

      <VehicleFilters
        filters={filters}
        onChange={updateFilters}
        onReset={reset}
        resultCount={loading ? null : pagination.total}
      />

      <section className="mt-8">
        {error && (
          <div className="card border-red-500/30 bg-red-500/[.07] p-6">
            <h3 className="text-xl text-red-200">Couldn&apos;t load vehicles</h3>
            <p className="mt-1 text-sm text-red-300/80">{error}</p>
            <button className="btn-ghost mt-4" onClick={refresh}>
              Try again
            </button>
          </div>
        )}

        {!error && loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && !loading && vehicles.length === 0 && (
          <EmptyState
            title="No vehicles match"
            message="Try widening your price range or clearing the filters to see the full fleet."
            action={
              <button className="btn-primary mt-2" onClick={reset}>
                Clear filters
              </button>
            }
          />
        )}

        {!error && !loading && vehicles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map((v) => (
              <VehicleCard
                key={v._id}
                vehicle={v}
                isAdmin={isAdmin}
                onPurchase={openPurchase}
                onRestock={openRestock}
                onEdit={(veh) => setFormModal({ open: true, vehicle: veh })}
                onDelete={(veh) => setConfirm({ open: true, vehicle: veh })}
              />
            ))}
          </div>
        )}

        <div className="mt-8">
          <Pagination page={pagination.page || page} totalPages={pagination.totalPages} onPage={setPage} />
        </div>
      </section>

      <QuantityModal
        open={qtyModal.open}
        vehicle={qtyModal.vehicle}
        mode={qtyModal.mode}
        onClose={() => setQtyModal({ open: false, vehicle: null, mode: "purchase" })}
        onConfirm={handleQuantity}
      />

      <VehicleFormModal
        open={formModal.open}
        vehicle={formModal.vehicle}
        onClose={() => setFormModal({ open: false, vehicle: null })}
        onSaved={refresh}
      />

      <ConfirmModal
        open={confirm.open}
        title="Delete vehicle"
        message={`Permanently remove ${confirm.vehicle?.make ?? ""} ${confirm.vehicle?.model ?? ""} from the inventory? This cannot be undone.`}
        confirmLabel="Delete"
        onClose={() => setConfirm({ open: false, vehicle: null })}
        onConfirm={handleDelete}
      />
    </main>
  );
}
