import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MapIcon, LogOutIcon, PlusIcon } from "../components/common/Icons";

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150"
    style={{ color: "var(--steel-light)" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = "var(--cream)";
      e.currentTarget.style.backgroundColor = "var(--brand-light)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = "var(--steel-light)";
      e.currentTarget.style.backgroundColor = "transparent";
    }}
  >
    {children}
  </Link>
);

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--cream)" }}>
      {/* Navbar */}
      <nav
        className="border-b sticky top-0 z-40"
        style={{ backgroundColor: "var(--brand)", borderColor: "var(--brand-dark)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--sand)" }}
            >
              <MapIcon size={16} style={{ color: "var(--brand)" }} />
            </div>
            <span className="text-lg font-extrabold tracking-tight" style={{ color: "var(--cream)" }}>
              ZeroCivicSense
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/raise-ticket">
                  <PlusIcon size={13} />
                  Raise Ticket
                </NavLink>
                <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--brand-light)" }} />
                <span className="text-xs hidden sm:block px-2" style={{ color: "var(--steel)" }}>
                  {user.name}
                </span>
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150"
                  style={{ color: "var(--steel-light)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.backgroundColor = "var(--brand-light)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--steel-light)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <LogOutIcon size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-150"
                  style={{ backgroundColor: "var(--sand)", color: "var(--brand)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--sand-dark)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--sand)"; }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="text-center text-xs py-5 border-t"
        style={{ color: "var(--steel-dark)", borderColor: "var(--sand-dark)", backgroundColor: "var(--sand-light)" }}
      >
        © {new Date().getFullYear()} ZeroCivicSense &mdash; AI-Powered Civic Infrastructure Verification
      </footer>
    </div>
  );
};

export default MainLayout;
