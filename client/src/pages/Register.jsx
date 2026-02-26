import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import Button from "../components/common/Button";
import { MapIcon, UserIcon, BuildingIcon, HardHatIcon, GavelIcon } from "../components/common/Icons";

const ROLE_OPTIONS = [
  { value: "citizen",   label: "Citizen",        Icon: UserIcon,     desc: "Report issues in your area" },
  { value: "official",  label: "Public Official", Icon: GavelIcon,    desc: "Endorse tickets & assign contractors" },
  { value: "contractor", label: "Contractor",     Icon: HardHatIcon,  desc: "Upload work proof" },
  { value: "admin",     label: "Admin",           Icon: BuildingIcon, desc: "Manage & approve tickets" },
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "citizen", department: "" });

  const DEPARTMENTS = ["PWD", "Water Works", "Electricity Board", "Sanitation", "Drainage", "Other"];
  const showDepartment = form.role === "contractor" || form.role === "official";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("All fields are required."); return; }
    try {
      setLoading(true);
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "var(--cream)",
    border: "1.5px solid var(--sand-dark)",
    color: "var(--brand)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl shadow-xl overflow-hidden"
          style={{ backgroundColor: "var(--sand-light)", border: "1px solid var(--sand-dark)" }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center" style={{ backgroundColor: "var(--brand)" }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "var(--sand)" }}
            >
              <MapIcon size={22} style={{ color: "var(--brand)" }} />
            </div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--cream)" }}>Create Account</h1>
            <p className="text-sm mt-1" style={{ color: "var(--steel-light)" }}>Join ZeroCivicSense today</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            {error && (
              <div
                className="text-sm px-4 py-2.5 rounded-lg mb-5 border"
                style={{ backgroundColor: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--brand)" }}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--sand-dark)"; }}
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--brand)" }}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--sand-dark)"; }}
                />
              </div>
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--brand)" }}>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--sand-dark)"; }}
                />
              </div>
              {/* Role */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--brand)" }}>I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, role: value }))}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center text-xs font-semibold transition-all duration-150"
                      style={form.role === value
                        ? { backgroundColor: "var(--brand)", color: "var(--cream)", borderColor: "var(--brand)" }
                        : { backgroundColor: "var(--cream)", color: "var(--steel-dark)", borderColor: "var(--sand-dark)" }
                      }
                    >
                      <Icon size={16} />
                      {label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department — only for contractor / official */}
              {showDepartment && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--brand)" }}>Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--sand-dark)"; }}
                  >
                    <option value="">Select department…</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-1">
                <Button type="submit" fullWidth loading={loading}>Create Account</Button>
              </div>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: "var(--steel-dark)" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold" style={{ color: "var(--brand)" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
