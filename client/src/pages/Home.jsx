import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MapPinIcon, CpuIcon, BuildingIcon, ArrowRightIcon, ShieldCheckIcon } from "../components/common/Icons";

const FEATURES = [
  {
    Icon: MapPinIcon,
    title: "Geo-Tagged Reports",
    desc: "Every civic issue is pinned to exact GPS coordinates for accurate location tracking and dispatch.",
  },
  {
    Icon: CpuIcon,
    title: "AI Verification",
    desc: "Our AI pipeline detects tampered photos and estimates real work progress automatically.",
  },
  {
    Icon: BuildingIcon,
    title: "Full Accountability",
    desc: "Citizens vote, admins approve, contractors submit proof. Complete immutable audit trail.",
  },
];

const STATS = [
  { value: "3 Roles", label: "Citizen · Government Official · Authority" },
  { value: "AI-Powered", label: "Tamper Detection + Progress AI" },
  { value: "Real-Time", label: "Live Status Tracking" },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ backgroundColor: "var(--cream)" }}>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 60%, var(--steel) 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "var(--sand)" }}
        />
        <div
          className="absolute bottom-0 -left-16 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: "var(--steel-light)" }}
        />

        <div className="max-w-5xl mx-auto px-6 py-28 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{ backgroundColor: "rgba(240,240,219,0.12)", color: "var(--sand)", borderColor: "rgba(225,217,188,0.25)" }}>
            <ShieldCheckIcon size={13} />
            AI-Powered Civic Infrastructure
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-5" style={{ color: "var(--cream)" }}>
            Fix Your City,{" "}
            <span
              className="inline-block px-2"
              style={{ color: "var(--sand)", WebkitTextDecoration: "none" }}
            >
              Verified by AI.
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--steel-light)" }}>
            Report infrastructure issues, track real-time progress, and ensure government
            contractors are held accountable — powered by an AI verification engine.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg"
                style={{ backgroundColor: "var(--sand)", color: "var(--brand)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--sand-dark)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--sand)"; }}
              >
                Go to Dashboard <ArrowRightIcon size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg"
                  style={{ backgroundColor: "var(--sand)", color: "var(--brand)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--sand-dark)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--sand)"; }}
                >
                  Get Started Free <ArrowRightIcon size={15} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold border transition-all duration-200"
                  style={{ color: "var(--cream)", borderColor: "rgba(225,217,188,0.4)", backgroundColor: "rgba(240,240,219,0.08)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(240,240,219,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(240,240,219,0.08)"; }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────── */}
      <section
        className="border-y"
        style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.value}>
              <p className="text-xl font-extrabold" style={{ color: "var(--brand)" }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--steel-dark)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-center mb-2" style={{ color: "var(--brand)" }}>
          How ZeroCivicSense Works
        </h2>
        <p className="text-center text-sm mb-12" style={{ color: "var(--steel-dark)" }}>
          A transparent, AI-enforced lifecycle for every civic complaint.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="rounded-2xl p-6 border transition-shadow duration-200 hover:shadow-lg group"
              style={{
                backgroundColor: "var(--sand-light)",
                borderColor: "var(--sand-dark)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200"
                style={{ backgroundColor: "var(--brand)", color: "var(--sand)" }}
              >
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: "var(--brand)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--steel-dark)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      {!user && (
        <section
          className="py-16"
          style={{ backgroundColor: "var(--brand)" }}
        >
          <div className="max-w-xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-extrabold mb-3" style={{ color: "var(--cream)" }}>
              Ready to hold your city accountable?
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--steel-light)" }}>
              Join ZeroCivicSense and start reporting civic issues in under a minute.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200"
              style={{ backgroundColor: "var(--sand)", color: "var(--brand)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--sand-dark)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--sand)"; }}
            >
              Create Free Account <ArrowRightIcon size={15} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
