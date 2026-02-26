import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MapIcon, LogOutIcon, ClipboardIcon, BuildingIcon, HardHatIcon, PlusIcon, UserIcon } from "../components/common/Icons";

const NAV_ICONS = {
  "/dashboard": <ClipboardIcon size={15} />,
  "/raise-ticket": <PlusIcon size={15} />,
  "/dashboard/tickets": <ClipboardIcon size={15} />,
  "/dashboard/users": <UserIcon size={15} />,
};

const ROLE_ICONS = {
  citizen: <ClipboardIcon size={15} />,
  admin: <BuildingIcon size={15} />,
  contractor: <HardHatIcon size={15} />,
};

const NAV_LINKS = {
  citizen: [
    { label: "My Tickets", to: "/dashboard" },
    { label: "Raise Ticket", to: "/raise-ticket" },
  ],
  admin: [
    { label: "Overview", to: "/dashboard" },
    { label: "All Tickets", to: "/dashboard/tickets" },
    { label: "Users", to: "/dashboard/users" },
  ],
  contractor: [
    { label: "Assigned Work", to: "/dashboard" },
  ],
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV_LINKS[user?.role] || [];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--cream)" }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex-col py-6 px-4 hidden md:flex border-r"
        style={{ backgroundColor: "var(--brand)", borderColor: "var(--brand-dark)" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8 px-2 select-none">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--sand)" }}
          >
            <MapIcon size={14} style={{ color: "var(--brand)" }} />
          </div>
          <span className="text-base font-extrabold tracking-tight" style={{ color: "var(--cream)" }}>
            ZeroCivicSense
          </span>
        </Link>

        {/* Role badge */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
          style={{ backgroundColor: "var(--brand-light)" }}
        >
          <span style={{ color: "var(--sand)" }}>{ROLE_ICONS[user?.role]}</span>
          <span className="text-xs font-semibold capitalize" style={{ color: "var(--steel-light)" }}>
            {user?.role} Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: "var(--sand)", color: "var(--brand)" }
                  : { color: "var(--steel-light)" }
              }
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  e.currentTarget.style.backgroundColor = "var(--brand-light)";
                  e.currentTarget.style.color = "var(--cream)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.dataset.active) {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "var(--steel-light)";
                }
              }}
            >
              <span>{NAV_ICONS[link.to]}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t pt-4 mt-4" style={{ borderColor: "var(--brand-light)" }}>
          <div className="flex items-center gap-2 px-3 mb-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: "var(--sand)", color: "var(--brand)" }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--cream)" }}>
                {user?.name}
              </p>
              <p className="text-xs capitalize" style={{ color: "var(--steel)" }}>
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
            style={{ color: "#f87171" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--brand-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <LogOutIcon size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
