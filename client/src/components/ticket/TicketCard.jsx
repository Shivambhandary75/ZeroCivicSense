import React from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, ArrowRightIcon } from "../common/Icons";

const STATUS_META = {
  pending:     { bg: "#fef9e7", color: "#b45309", border: "#fcd34d" },
  in_progress: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  completed:   { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  rejected:    { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
};

const TicketCard = ({ ticket }) => {
  const { _id, title, description, status, location, createdAt } = ticket;
  const meta = STATUS_META[status] || { bg: "var(--sand-light)", color: "var(--steel-dark)", border: "var(--sand-dark)" };

  return (
    <div
      className="rounded-2xl p-5 border transition-shadow duration-200 hover:shadow-lg flex flex-col gap-3"
      style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}
    >
      {/* Title + status */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-snug truncate flex-1" style={{ color: "var(--brand)" }}>
          {title}
        </h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap border"
          style={{ backgroundColor: meta.bg, color: meta.color, borderColor: meta.border }}
        >
          {status?.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--steel-dark)" }}>
        {description}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--steel-dark)" }}>
        <MapPinIcon size={12} />
        <span>{location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--sand-dark)" }}>
        <span className="text-xs" style={{ color: "var(--steel-dark)" }}>
          {new Date(createdAt).toLocaleDateString()}
        </span>
        <Link
          to={`/tickets/${_id}`}
          className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-75"
          style={{ color: "var(--brand)" }}
        >
          View Details <ArrowRightIcon size={11} />
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;
