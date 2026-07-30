import { useCallback, useEffect, useRef, useState } from "react";
import { vehiclesApi } from "../api/client";

export const EMPTY_FILTERS = { make: "", model: "", category: "", minPrice: "", maxPrice: "" };

const hasFilters = (f) => Object.values(f).some((v) => String(v ?? "").trim() !== "");

/**
 * Loads the vehicle list, switching between /api/vehicles and /api/vehicles/search
 * depending on whether any filter is active. Filter input is debounced.
 */
export default function useVehicles() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reqId = useRef(0);

  const fetchNow = useCallback(async (activeFilters, activePage) => {
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const params = { ...activeFilters, page: activePage };
      const data = hasFilters(activeFilters)
        ? await vehiclesApi.search(params)
        : await vehiclesApi.list(params);

      if (id !== reqId.current) return; // a newer request already won
      setVehicles(Array.isArray(data?.vehicles) ? data.vehicles : []);
      setPagination({
        page: data?.pagination?.page ?? activePage,
        totalPages: data?.pagination?.totalPages ?? 1,
        total: data?.pagination?.total ?? (data?.vehicles?.length || 0),
      });
    } catch (err) {
      if (id !== reqId.current) return;
      setError(err.message);
      setVehicles([]);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, []);

  // Debounce so typing in the search box doesn't hammer the API.
  useEffect(() => {
    const t = setTimeout(() => fetchNow(filters, page), 300);
    return () => clearTimeout(t);
  }, [filters, page, fetchNow]);

  const updateFilters = useCallback((next) => {
    setFilters(next);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const refresh = useCallback(() => fetchNow(filters, page), [fetchNow, filters, page]);

  // Patch one vehicle in place after purchase/restock/update — avoids a full reload.
  const patchVehicle = useCallback((updated) => {
    setVehicles((list) => list.map((v) => (v._id === updated._id ? { ...v, ...updated } : v)));
  }, []);

  return {
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
  };
}
