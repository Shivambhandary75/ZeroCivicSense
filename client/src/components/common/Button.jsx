import React from "react";
import { SpinnerIcon } from "./Icons";

const VARIANT_STYLES = {
  primary: {
    backgroundColor: "var(--brand)",
    color: "var(--cream)",
    borderColor: "transparent",
    hoverBg: "var(--brand-dark)",
  },
  secondary: {
    backgroundColor: "var(--sand)",
    color: "var(--brand)",
    borderColor: "transparent",
    hoverBg: "var(--sand-dark)",
  },
  danger: {
    backgroundColor: "#dc2626",
    color: "#fff",
    borderColor: "transparent",
    hoverBg: "#b91c1c",
  },
  success: {
    backgroundColor: "#16a34a",
    color: "#fff",
    borderColor: "transparent",
    hoverBg: "#15803d",
  },
  outline: {
    backgroundColor: "transparent",
    color: "var(--brand)",
    borderColor: "var(--steel)",
    hoverBg: "var(--sand-light)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--brand)",
    borderColor: "transparent",
    hoverBg: "var(--sand-light)",
  },
};

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  fullWidth = false,
}) => {
  const s = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        fullWidth ? "w-full" : ""
      } ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={{
        backgroundColor: s.backgroundColor,
        color: s.color,
        borderColor: s.borderColor,
        focusRingColor: "var(--steel)",
      }}
      onMouseEnter={(e) => { if (!disabled && !loading) e.currentTarget.style.backgroundColor = s.hoverBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = s.backgroundColor; }}
    >
      {loading && <SpinnerIcon size={15} />}
      {children}
    </button>
  );
};

export default Button;
