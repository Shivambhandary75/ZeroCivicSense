import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import { MapIcon, ShieldCheckIcon } from "../components/common/Icons";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl shadow-xl overflow-hidden"
          style={{ backgroundColor: "var(--sand-light)", border: "1px solid var(--sand-dark)" }}
        >
          {/* Card Header */}
          <div
            className="px-8 pt-8 pb-6 text-center"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "var(--sand)" }}
            >
              <MapIcon size={22} style={{ color: "var(--brand)" }} />
            </div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--cream)" }}>Welcome Back</h1>
            <p className="text-sm mt-1" style={{ color: "var(--steel-light)" }}>Sign in to ZeroCivicSense</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            {error && (
              <div
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg mb-5 border"
                style={{ backgroundColor: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
              >
                <ShieldCheckIcon size={14} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--brand)" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm transition-all duration-150 outline-none"
                  style={{
                    backgroundColor: "var(--cream)",
                    border: "1.5px solid var(--sand-dark)",
                    color: "var(--brand)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--sand-dark)"; }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--brand)" }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm transition-all duration-150 outline-none"
                  style={{
                    backgroundColor: "var(--cream)",
                    border: "1.5px solid var(--sand-dark)",
                    color: "var(--brand)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--sand-dark)"; }}
                />
              </div>
              <div className="pt-1">
                <Button type="submit" fullWidth loading={loading}>Sign In</Button>
              </div>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: "var(--steel-dark)" }}>
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold" style={{ color: "var(--brand)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--brand-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--brand)"; }}
              >
                Register free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
