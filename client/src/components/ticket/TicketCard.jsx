import React from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, ArrowRightIcon } from "../common/Icons";

const STATUS_META = {
  pending:          { bg: "#fef9e7", color: "#b45309", border: "#fcd34d", label: "Pending" },
  in_progress:      { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd", label: "In Progress" },
  proof_submitted:  { bg: "#f5f3ff", color: "#7c3aed", border: "#c4b5fd", label: "Proof Submitted" },
  completed:        { bg: "#f0fdf4", color: "#15803d", border: "#86efac", label: "Completed" },
  rejected:         { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5", label: "Rejected" },
};

// Shared AI review block — used in TicketCard, dashboards, map popup
export const ProofAiReview = ({ ticket, compact = false }) => {
  const { proofAiStatus, proofAiVerdict, proofAiScore, proofAiProgress, proofAiTamper } = ticket;
  if (!proofAiStatus || proofAiStatus === "pending") return null;

  if (proofAiStatus === "processing") {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
        style={{ backgroundColor: "#eff6ff", border: "1px solid #93c5fd" }}>
        <div className="w-3 h-3 rounded-full border-2 animate-spin flex-shrink-0"
          style={{ borderColor: "#1d4ed8", borderTopColor: "transparent" }} />
        <span className="text-xs font-semibold" style={{ color: "#1d4ed8" }}>AI analysing proof…</span>
      </div>
    );
  }

  if (proofAiStatus === "failed") {
    return (
      <div className="px-2 py-1.5 rounded-lg text-xs font-semibold"
        style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}>
        AI analysis failed
      </div>
    );
  }

  // done
  const verdictMeta = {
    authentic:    { bg: "#f0fdf4", color: "#15803d", border: "#86efac", label: "AI: Authentic" },
    suspicious:   { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5", label: "AI: Suspicious" },
    inconclusive: { bg: "#fefce8", color: "#b45309", border: "#fcd34d", label: "AI: Inconclusive" },
  };
  const vm = verdictMeta[proofAiVerdict] || verdictMeta.inconclusive;

  return (
    <div className="rounded-lg px-2 py-2 space-y-1.5"
      style={{ backgroundColor: vm.bg, border: `1px solid ${vm.border}` }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold" style={{ color: vm.color }}>{vm.label}</span>
        {proofAiTamper && (
          <span className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: "#dc2626", color: "#fff" }}>Tamper Detected</span>
        )}
      </div>
      {!compact && (
        <div className="flex gap-3 text-xs" style={{ color: vm.color }}>
          {proofAiScore != null && (
            <span>Confidence: <strong>{proofAiScore}%</strong></span>
          )}
          {proofAiProgress != null && (
            <span>Work done: <strong>{proofAiProgress}%</strong></span>
          )}
        </div>
      )}
      {proofAiScore != null && (
        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: `${vm.border}` }}>
          <div className="h-1.5 rounded-full transition-all"
            style={{ width: `${proofAiScore}%`, backgroundColor: vm.color }} />
        </div>
      )}
    </div>
  );
};

const TicketCard = ({ ticket }) => {
  const { _id, title, description, status, location, createdAt, rejectionReason, assignedTo, voteCount } = ticket;
  const meta = STATUS_META[status] || { bg: "var(--sand-light)", color: "var(--steel-dark)", border: "var(--sand-dark)", label: status };
  const isBlacklisted = assignedTo && assignedTo.isActive === false;

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
          {meta.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--steel-dark)" }}>
        {description}
      </p>

      {/* Rejection reason */}
      {status === "rejected" && rejectionReason && (
        <p className="text-xs px-2 py-1 rounded-lg italic" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
          Rejected: {rejectionReason}
        </p>
      )}

      {/* AI proof review */}
      {(status === "proof_submitted" || status === "completed") && ticket.proofAiStatus && ticket.proofAiStatus !== "pending" && (
        <ProofAiReview ticket={ticket} />
      )}

      {/* Assigned official */}
      {assignedTo && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs" style={{ color: "var(--steel-dark)" }}>Assigned:</span>
          <span className="text-xs font-semibold" style={{ color: isBlacklisted ? "#dc2626" : "var(--brand)" }}>
            {assignedTo.name}
          </span>
          {isBlacklisted && (
            <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: "#dc2626", color: "#fff" }}>
              Blacklisted
            </span>
          )}
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--steel-dark)" }}>
        <MapPinIcon size={12} />
        <span className="truncate">{location?.address
          ? location.address.split(",").slice(0, 2).join(",")
          : `${location?.lat?.toFixed(4)}, ${location?.lng?.toFixed(4)}`}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--sand-dark)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "var(--steel-dark)" }}>
            {new Date(createdAt).toLocaleDateString()}
          </span>
          {voteCount > 0 && (
            <span className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
              {voteCount} {voteCount === 1 ? "vote" : "votes"}
            </span>
          )}
        </div>
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
