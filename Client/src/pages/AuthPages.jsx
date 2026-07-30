import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function AuthShell({ title, tagline, children, footer }) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <section className="hidden lg:block">
        <p className="chip">Vehicle marketplace</p>
        <h1 className="mt-5 text-6xl leading-[0.95] text-white">
          The fastest way to
          <br />
          <span className="text-brand-500">own the road.</span>
        </h1>
        <p className="mt-5 max-w-md text-slate-400">
          Live inventory across cars, bikes, trucks, SUVs and vans. Filter by make, model and
          budget, then buy in a single click — stock updates in real time.
        </p>
        <dl className="mt-10 grid grid-cols-3 gap-4">
          {[
            ["5", "Categories"],
            ["1-click", "Checkout"],
            ["Live", "Stock counts"],
          ].map(([k, v]) => (
            <div key={v} className="card px-4 py-3">
              <dt className="display text-2xl text-brand-500">{k}</dt>
              <dd className="text-xs uppercase tracking-widest text-slate-500">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card animate-fade-up p-7 sm:p-9">
        <h2 className="text-4xl text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{tagline}</p>
        <div className="mt-7">{children}</div>
        <p className="mt-6 text-center text-sm text-slate-400">{footer}</p>
      </section>
    </main>
  );
}

export function LoginPage() {
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (user) return <Navigate to={location.state?.from || "/"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.email.trim() || !form.password) {
      setErr("email and password are required");
      return;
    }
    setBusy(true);
    try {
      const profile = await login(form.email.trim(), form.password);
      toast.success(`Welcome back, ${profile.name}`);
      navigate(location.state?.from || "/", { replace: true });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      tagline="Log in to purchase vehicles and manage your inventory."
      footer={
        <>
          No account yet?{" "}
          <Link to="/register" className="font-semibold text-brand-500 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="l-email">Email</label>
          <input
            id="l-email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="l-pass">Password</label>
          <input
            id="l-pass"
            type="password"
            autoComplete="current-password"
            className="input"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {err && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {err}
          </p>
        )}

        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Signing in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { user, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setErr("name, email, and password are required");
      return;
    }
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirm) {
      setErr("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const profile = await register(form.name.trim(), form.email.trim(), form.password);
      toast.success(`Account created — welcome, ${profile.name}`);
      navigate("/", { replace: true });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      tagline="It takes about twenty seconds."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand-500 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="r-name">Full name</label>
          <input
            id="r-name"
            className="input"
            placeholder="Alex Carter"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="r-email">Email</label>
          <input
            id="r-email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="r-pass">Password</label>
            <input
              id="r-pass"
              type="password"
              autoComplete="new-password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="r-conf">Confirm</label>
            <input
              id="r-conf"
              type="password"
              autoComplete="new-password"
              className="input"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>
        </div>

        {err && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {err}
          </p>
        )}

        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
