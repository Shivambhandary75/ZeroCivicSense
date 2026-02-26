import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AlertTriangleIcon, CheckIcon } from "../common/Icons";

const STATUS_META = {
  pending:     { bg: "#fef9e7", color: "#b45309", border: "#fcd34d" },
  in_progress: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  completed:   { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  rejected:    { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
};

const TicketDetails = ({ ticket }) => {
  if (!ticket) return null;

  const {
    title,
    description,
    status,
    category,
    location,
    imageUrl,
    createdAt,
    createdBy,
    verification,
  } = ticket;

  return (
    <div className="space-y-5">
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

      {/* Image Evidence */}
      {imageUrl && (
        <div>
          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--brand)" }}>Image Evidence</h4>
          <img src={imageUrl} alt="ticket evidence" className="rounded-xl w-full max-h-64 object-cover" />
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

      {/* AI Verification */}
      {verification && (
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--sand-light)", border: "1px solid var(--sand-dark)" }}>
          <h4 className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--brand)" }}>AI Verification Results</h4>
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

      {/* Meta */}
      <div className="flex justify-between text-xs" style={{ color: "var(--steel-dark)", borderTop: "1px solid var(--sand-dark)", paddingTop: "0.75rem" }}>
        <span>Raised by: {createdBy?.name || "Citizen"}</span>
        <span>{new Date(createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default TicketDetails;
