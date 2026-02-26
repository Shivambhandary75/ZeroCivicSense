import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../components/common/Icons";

const NotFound = () => (
  <div
    className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    style={{ backgroundColor: "var(--cream)" }}
  >
    <p className="text-9xl font-black" style={{ color: "var(--sand)" }}>404</p>
    <h1 className="text-2xl font-extrabold mt-2" style={{ color: "var(--brand)" }}>Page Not Found</h1>
    <p className="text-sm mt-2 mb-8" style={{ color: "var(--steel-dark)" }}>
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-150"
      style={{ backgroundColor: "var(--brand)", color: "var(--cream)" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--brand-dark)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--brand)"; }}
    >
      Go Home <ArrowRightIcon size={14} />
    </Link>
  </div>
);

export default NotFound;
