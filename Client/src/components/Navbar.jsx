import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-ink-950 shadow-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M5 11l1.5-4.2A2 2 0 018.4 5.5h7.2a2 2 0 011.9 1.3L19 11h.5a1.5 1.5 0 011.5 1.5V17a1 1 0 01-1 1h-1.2a1.8 1.8 0 01-3.6 0H8.8a1.8 1.8 0 01-3.6 0H4a1 1 0 01-1-1v-4.5A1.5 1.5 0 014.5 11H5zm2.2-.5h9.6l-1-2.8a.6.6 0 00-.6-.4H8.8a.6.6 0 00-.6.4l-1 2.8z" />
        </svg>
      </span>
      <span className="display text-2xl leading-none text-white">
        Auto<span className="text-brand-500">Vault</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const link = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={link} end>
            Inventory
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={link}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-[11px] uppercase tracking-widest text-brand-500">{user.role}</p>
              </div>
              <button className="btn-ghost" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="btn-ghost md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={link} end onClick={() => setOpen(false)}>
              Inventory
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={link} onClick={() => setOpen(false)}>
                Admin
              </NavLink>
            )}
            <div className="mt-2 flex gap-2">
              {user ? (
                <button className="btn-ghost flex-1" onClick={handleLogout}>
                  Sign out ({user.name})
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost flex-1" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
