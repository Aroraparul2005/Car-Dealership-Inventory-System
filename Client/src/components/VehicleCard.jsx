import { CATEGORIES, currency, FALLBACK_IMAGE } from "../lib/format";

function Stock({ quantity }) {
  if (quantity <= 0)
    return (
      <span className="chip border-red-500/30 bg-red-500/10 text-red-300">Sold out</span>
    );
  if (quantity <= 3)
    return (
      <span className="chip border-amber-500/30 bg-amber-500/10 text-amber-300">
        Only {quantity} left
      </span>
    );
  return (
    <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
      {quantity} in stock
    </span>
  );
}

export default function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock, isAdmin }) {
  const soldOut = Number(vehicle.quantity) <= 0;
  const category = CATEGORIES.includes(vehicle.category) ? vehicle.category : "vehicle";

  return (
    <article className="card group flex animate-fade-up flex-col overflow-hidden transition hover:border-brand-500/30 hover:shadow-glow">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
        <img
          src={vehicle.image || FALLBACK_IMAGE}
          alt={`${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            soldOut ? "opacity-45 grayscale" : ""
          }`}
        />
        <span className="absolute left-3 top-3 chip bg-ink-950/70 backdrop-blur">{category}</span>
        <span className="absolute right-3 top-3">
          <Stock quantity={Number(vehicle.quantity) || 0} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl leading-none text-white">
          {vehicle.make} <span className="text-slate-400">{vehicle.model}</span>
        </h3>

        <p className="mt-3 text-3xl font-bold text-brand-500">{currency(vehicle.price)}</p>

        <div className="mt-5 flex flex-1 items-end gap-2">
          <button
            className="btn-primary flex-1"
            disabled={soldOut}
            onClick={() => onPurchase(vehicle)}
            title={soldOut ? "Out of stock" : "Purchase this vehicle"}
          >
            {soldOut ? "Out of stock" : "Purchase"}
          </button>

          {isAdmin && (
            <>
              <button className="btn-ghost px-3" onClick={() => onRestock(vehicle)} title="Restock">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <button className="btn-ghost px-3" onClick={() => onEdit(vehicle)} title="Edit">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />
                </svg>
              </button>
              <button className="btn-danger px-3" onClick={() => onDelete(vehicle)} title="Delete">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
