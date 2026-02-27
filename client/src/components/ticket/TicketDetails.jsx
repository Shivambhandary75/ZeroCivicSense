import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangleIcon,
  CheckIcon,
  EyeIcon,
  PackageIcon,
  ShovelIcon,
  WrenchIcon,
  ClipboardCheckIcon,
  FlagIcon,
  SpinnerIcon,
} from "../common/Icons";
import { ProofAiReview } from "./TicketCard";

const STATUS_META = {
  pending:     { bg: "#fef9e7", color: "#b45309", border: "#fcd34d" },
  in_progress: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  completed:   { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  rejected:    { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
};

const STAGE_META = {
  site_inspection: { label: "Site Inspection",  Icon: EyeIcon,           color: "#0369a1" },
  procurement:     { label: "Procurement",       Icon: PackageIcon,        color: "#7c3aed" },
  groundwork:      { label: "Groundwork",        Icon: ShovelIcon,         color: "#b45309" },
  active_work:     { label: "Active Work",       Icon: WrenchIcon,         color: "#0f766e" },
  quality_check:   { label: "Quality Check",     Icon: ClipboardCheckIcon, color: "#1d4ed8" },
  work_completed:  { label: "Work Completed",    Icon: FlagIcon,           color: "#15803d" },
};

// ── AI badge for each work log entry ────────────────────────────
const AIBadge = ({ aiResult }) => {
  if (!aiResult || aiResult.status === "pending" || aiResult.status === "processing") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ backgroundColor: "#eff6ff", border: "1px solid #93c5fd" }}>
        <div className="w-3 h-3 rounded-full border-2 animate-spin flex-shrink-0"
          style={{ borderColor: "#1d4ed8", borderTopColor: "transparent" }} />
        <span className="text-xs font-semibold" style={{ color: "#1d4ed8" }}>AI analysing proof…</span>
      </div>
    );
  }
  if (aiResult.status === "failed") {
    return (
      <div className="px-3 py-2 rounded-lg text-xs font-semibold"
        style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}>
        AI analysis failed
      </div>
    );
  }

  const tampered = aiResult.tamperFlag;
  const score    = aiResult.aiScore ?? null;
  const verdict  = tampered ? "tampered" : score >= 70 ? "authentic" : "inconclusive";

  const vm = {
    authentic:    { bg: "#f0fdf4", color: "#15803d", border: "#86efac", label: "Authentic" },
    tampered:     { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5", label: "Tampered / Suspicious" },
    inconclusive: { bg: "#fefce8", color: "#b45309", border: "#fcd34d", label: "Inconclusive" },
  }[verdict];

  return (
    <div className="rounded-lg px-3 py-2.5 space-y-2"
      style={{ backgroundColor: vm.bg, border: `1px solid ${vm.border}` }}>
      {/* Verdict header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {verdict === "authentic" && <CheckIcon size={13} style={{ color: vm.color }} />}
          {verdict === "tampered"  && <AlertTriangleIcon size={13} style={{ color: vm.color }} />}
          <span className="text-xs font-bold" style={{ color: vm.color }}>
            AI Verdict: {vm.label}
          </span>
        </div>
        {tampered && (
          <span className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: "#dc2626", color: "#fff" }}>
            Tamper Detected
          </span>
        )}
      </div>
      {/* Score + progress */}
      <div className="flex gap-4 text-xs" style={{ color: vm.color }}>
        {score != null && <span>Confidence: <strong>{score}%</strong></span>}
        {aiResult.progressEstimate != null && (
          <span>Work done: <strong>{aiResult.progressEstimate}%</strong></span>
        )}
      </div>
      {/* Score bar */}
      {score != null && (
        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: vm.border }}>
          <div className="h-1.5 rounded-full" style={{ width: `${score}%`, backgroundColor: vm.color }} />
        </div>
      )}
    </div>
  );
};

// ── Work Log Timeline ────────────────────────────────────────────
const WorkTimeline = ({ workLogs }) => {
  if (!workLogs || workLogs.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold mb-4 uppercase tracking-wide" style={{ color: "var(--brand)" }}>
        Work Progress Timeline
      </h4>
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: "var(--sand-dark)" }}
        />
        <div className="space-y-6">
          {workLogs.map((log, i) => {
            const meta = STAGE_META[log.stage] || { label: log.stage, Icon: WrenchIcon, color: "#6b7280" };
            const { Icon } = meta;
            const isLast = i === workLogs.length - 1;
            return (
              <div key={log._id} className="relative pl-12">
                {/* Stage icon dot */}
                <div
                  className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2"
                  style={{
                    backgroundColor: isLast ? meta.color : "var(--cream)",
                    borderColor: meta.color,
                    color: isLast ? "white" : meta.color,
                  }}
                >
                  <Icon size={14} />
                </div>

                <div
                  className="rounded-xl p-4 border"
                  style={{ backgroundColor: "var(--cream)", borderColor: "var(--sand-dark)" }}
                >
                  {/* Stage label + date */}
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: meta.color + "18", color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs" style={{ color: "var(--steel-dark)" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--brand)" }}>
                    {log.description}
                  </p>

                  {/* Proof photo */}
                  {log.proofImageUrl && (
                    <img
                      src={log.proofImageUrl}
                      alt="work proof"
                      className="rounded-lg w-full max-h-52 object-cover mb-3"
                    />
                  )}

                  {/* AI work-proof analysis */}
                  {log.aiResult && (
                    <div className="mt-3 pt-2.5" style={{ borderTop: "1px solid var(--sand-dark)" }}>
                      <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--steel-dark)" }}>
                        AI Work Analysis
                      </p>
                      <AIBadge aiResult={log.aiResult} />
                    </div>
                  )}

                  {/* Contractor name */}
                  {log.contractorId?.name && (
                    <p className="text-xs mt-2" style={{ color: "var(--steel)" }}>
                      Logged by {log.contractorId.name}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Main TicketDetails ───────────────────────────────────────────
const TicketDetails = ({ ticket }) => {
  if (!ticket) return null;

  const {
    title,
    description,
    status,
    category,
    location,
    imageUrl,
    proofImageUrl,
    createdAt,
    createdBy,
    assignedTo,
    verification,
    workLogs,
  } = ticket;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold" style={{ color: "var(--brand)" }}>{title}</h2>
          <p className="text-xs mt-1" style={{ color: "var(--steel-dark)" }}>
            Category: <span className="capitalize font-semibold">{category}</span>
          </p>
        </div>
        {(() => {
          const meta = STATUS_META[status] || { bg: "var(--sand-light)", color: "var(--steel-dark)", border: "var(--sand-dark)" };
          return (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border whitespace-nowrap"
              style={{ backgroundColor: meta.bg, color: meta.color, borderColor: meta.border }}
            >
              {status?.replace("_", " ").toUpperCase()}
            </span>
          );
        })()}
      </div>

      {/* Description */}
      <div className="rounded-xl p-4" style={{ backgroundColor: "var(--cream)", border: "1px solid var(--sand-dark)" }}>
        <p className="text-sm leading-relaxed" style={{ color: "var(--brand)" }}>{description}</p>
      </div>

      {/* People involved */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {[
          { label: "Raised by",          value: createdBy?.name  || "Citizen" },
          { label: "Government Official", value: assignedTo?.name || "—"      },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-3"
            style={{ backgroundColor: "var(--sand-light)", border: "1px solid var(--sand-dark)" }}>
            <p className="font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--steel-dark)" }}>{label}</p>
            <p className="font-bold" style={{ color: "var(--brand)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Image Evidence */}
      {imageUrl && (
        <div>
          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--brand)" }}>Image Evidence</h4>
          <img src={imageUrl} alt="ticket evidence" className="rounded-xl w-full max-h-64 object-cover" />
        </div>
      )}

      {/* Work Proof + AI Review */}
      {proofImageUrl && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#7c3aed" }}>Work Proof</h4>
          <img
            src={proofImageUrl}
            alt="work proof"
            className="rounded-xl w-full max-h-64 object-cover cursor-pointer"
            onClick={() => window.open(proofImageUrl, "_blank")}
          />
          <ProofAiReview ticket={ticket} />
        </div>
      )}

      {/* Map */}
      {location?.lat && location?.lng && (
        <div>
          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--brand)" }}>Location</h4>
          <div className="h-48 rounded-xl overflow-hidden border" style={{ borderColor: "var(--sand-dark)" }}>
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[location.lat, location.lng]}>
                <Popup>{title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {/* Work Progress Timeline */}
      <WorkTimeline workLogs={workLogs} />

      {/* AI Verification (ticket-level) */}
      {verification && (
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--sand-light)", border: "1px solid var(--sand-dark)" }}>
          <h4 className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--brand)" }}>
            AI Verification — Initial Report
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl p-3" style={{ backgroundColor: "var(--cream)" }}>
              <p className="text-lg font-black" style={{ color: "var(--brand)" }}>
                {verification.aiScore ?? "--"}%
              </p>
              <p className="text-xs" style={{ color: "var(--steel-dark)" }}>AI Score</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "var(--cream)" }}>
              <p className="text-lg font-black" style={{ color: "#b45309" }}>
                {verification.progressEstimate ?? "--"}%
              </p>
              <p className="text-xs" style={{ color: "var(--steel-dark)" }}>Progress</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "var(--cream)" }}>
              <p
                className="flex items-center justify-center gap-1 text-lg font-bold"
                style={{ color: verification.tamperFlag ? "#dc2626" : "#15803d" }}
              >
                {verification.tamperFlag
                  ? <><AlertTriangleIcon size={18} /> Flagged</>
                  : <><CheckIcon size={18} /> Clean</>}
              </p>
              <p className="text-xs" style={{ color: "var(--steel-dark)" }}>Tamper</p>
            </div>
          </div>
        </div>
      )}

      {/* Meta footer */}
      <div className="flex justify-between text-xs" style={{ color: "var(--steel-dark)", borderTop: "1px solid var(--sand-dark)", paddingTop: "0.75rem" }}>
        <span>Raised by: {createdBy?.name || "Citizen"}</span>
        <span>{new Date(createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default TicketDetails;
