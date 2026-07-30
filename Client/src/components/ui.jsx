export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[16/10] animate-pulse bg-ink-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-ink-800" />
        <div className="h-7 w-1/3 animate-pulse rounded bg-ink-800" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-ink-800" />
      </div>
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <svg viewBox="0 0 24 24" className="h-12 w-12 text-ink-600" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <h3 className="text-2xl text-white">{title}</h3>
      <p className="max-w-sm text-sm text-slate-400">{message}</p>
      {action}
    </div>
  );
}

export function Pagination({ page, totalPages, onPage }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 pt-2">
      <button className="btn-ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      <span className="px-3 text-sm font-semibold text-slate-400">
        Page {page} of {totalPages}
      </span>
      <button className="btn-ghost" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </nav>
  );
}
