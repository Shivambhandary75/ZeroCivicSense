import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "./Icons";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(48,54,79,0.55)" }}
        onClick={onClose}
      />
      {/* Modal Box */}
      <div
        className={`relative rounded-2xl shadow-2xl w-full ${sizes[size]} z-10`}
        style={{ backgroundColor: "var(--cream)", border: "1px solid var(--sand-dark)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--sand-dark)", backgroundColor: "var(--sand-light)", borderRadius: "1rem 1rem 0 0" }}
        >
          <h2 className="text-base font-bold" style={{ color: "var(--brand)" }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors duration-150"
            style={{ color: "var(--steel-dark)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--sand-dark)"; e.currentTarget.style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--steel-dark)"; }}
          >
            <XIcon size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
