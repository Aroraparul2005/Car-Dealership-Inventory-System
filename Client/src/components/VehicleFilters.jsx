import { CATEGORIES } from "../lib/format";

export default function VehicleFilters({ filters, onChange, onReset, resultCount }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  const active =
    Object.entries(filters).filter(([, v]) => String(v ?? "").trim() !== "").length > 0;

  return (
    <section className="card p-5 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label className="label" htmlFor="f-make">Make</label>
          <input
            id="f-make"
            className="input"
            placeholder="Toyota, Yamaha, Volvo…"
            value={filters.make}
            onChange={set("make")}
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label" htmlFor="f-model">Model</label>
          <input
            id="f-model"
            className="input"
            placeholder="Corolla, R15, FH16…"
            value={filters.model}
            onChange={set("model")}
          />
        </div>

        <div>
          <label className="label" htmlFor="f-cat">Category</label>
          <select id="f-cat" className="input" value={filters.category} onChange={set("category")}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="f-min">Min price</label>
          <input
            id="f-min"
            type="number"
            min="0"
            className="input"
            placeholder="0"
            value={filters.minPrice}
            onChange={set("minPrice")}
          />
        </div>

        <div>
          <label className="label" htmlFor="f-max">Max price</label>
          <input
            id="f-max"
            type="number"
            min="0"
            className="input"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={set("maxPrice")}
          />
        </div>

        <div className="flex items-end">
          <button className="btn-ghost w-full" onClick={onReset} disabled={!active}>
            Clear filters
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs uppercase tracking-widest text-slate-500">
        {resultCount === null ? "Loading inventory…" : `${resultCount} vehicle(s) found`}
      </p>
    </section>
  );
}
