import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getPublicTickets, voteTicket, proofVoteTicket } from "../../services/ticketService";
import { useAuth } from "../../hooks/useAuth";
import { ProofAiReview } from "../ticket/TicketCard";

// Fix Leaflet default marker icons broken in Vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STATUS_COLORS = {
  pending:          "#b45309",
  in_progress:      "#1d4ed8",
  proof_submitted:  "#7c3aed",
  completed:        "#15803d",
  rejected:         "#dc2626",
};

const STATUS_LABELS = {
  pending:          "Pending",
  in_progress:      "In Progress",
  proof_submitted:  "Proof Submitted",
  completed:        "Completed",
  rejected:         "Rejected",
};

const makePin = (status, voteCount = 0) => {
  const color  = STATUS_COLORS[status] || "#64748b";
  const label  = voteCount > 0 ? voteCount : "";
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:36px;height:44px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.4));">
        <svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" width="36" height="44">
          <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z"
            fill="${color}" />
          <circle cx="18" cy="17" r="9" fill="white" opacity="0.92"/>
        </svg>
        <span style="
          position:absolute;top:7px;left:50%;transform:translateX(-50%);
          font-size:${label !== "" ? "9px" : "0"}px;
          font-weight:800;color:${color};line-height:1;
          font-family:system-ui,sans-serif;white-space:nowrap;
        ">${label}</span>
      </div>`,
    iconSize:   [36, 44],
    iconAnchor: [18, 44],
    popupAnchor:[0, -46],
  });
};

// Flies map to given coords
const FlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 15, { duration: 1.2 });
  }, [coords, map]);
  return null;
};

// Fits map to show all ticket markers
const FitBounds = ({ tickets }) => {
  const map = useMap();
  useEffect(() => {
    if (!tickets || tickets.length === 0) return;
    const bounds = tickets.map((t) => [t.location.lat, t.location.lng]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [tickets, map]);
  return null;
};

const CATEGORIES = ["all", "road", "water", "electricity", "garbage", "drainage", "other"];

const TicketMap = ({ height = "520px" }) => {
  const { user } = useAuth();
  const isCitizen = user?.role === "citizen";
  const [tickets, setTickets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [userCoords, setUserCoords] = useState(null);
  const [votedMap, setVotedMap]   = useState({});
  const [countMap, setCountMap]   = useState({});
  const [proofVoteMap, setProofVoteMap] = useState({}); // { ticketId: "up"|"down"|null }
  const [proofCountMap, setProofCountMap] = useState({}); // { ticketId: { up, down } }
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTickets = (cat) => {
    setLoading(true);
    const params = cat && cat !== "all" ? { category: cat } : {};
    getPublicTickets(params)
      .then((data) => {
        setTickets(data);
        const vm = {}, cm = {}, pvm = {}, pcm = {};
        data.forEach((t) => {
          vm[t._id] = t.userVoted;
          cm[t._id] = t.voteCount ?? 0;
          pvm[t._id] = t.userProofVote ?? null;
          pcm[t._id] = { up: t.proofUpCount ?? 0, down: t.proofDownCount ?? 0 };
        });
        setVotedMap(vm);
        setCountMap(cm);
        setProofVoteMap(pvm);
        setProofCountMap(pcm);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(catFilter); }, [catFilter]);

  const handleVote = async (ticketId, e) => {
    e.stopPropagation();
    if (!isCitizen) return;
    const res = await voteTicket(ticketId);
    setVotedMap((p) => ({ ...p, [ticketId]: res.voted }));
    setCountMap((p) => ({ ...p, [ticketId]: res.voteCount }));
  };

  const handleProofVote = async (ticketId, direction, e) => {
    e.stopPropagation();
    if (!isCitizen) return;
    const res = await proofVoteTicket(ticketId, direction);
    setProofVoteMap((p) => ({ ...p, [ticketId]: res.userProofVote }));
    setProofCountMap((p) => ({ ...p, [ticketId]: { up: res.proofUpCount, down: res.proofDownCount } }));
  };

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Could not get your location. Please allow location access."),
    );
  };

  const visibleTickets = tickets.filter((t) => {
    if (!t.location?.lat || !t.location?.lng) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Filters bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-2.5 py-1 text-xs font-semibold rounded-full border transition-all duration-150"
              style={catFilter === c
                ? { backgroundColor: "var(--brand)", color: "var(--cream)", borderColor: "var(--brand)" }
                : { backgroundColor: "transparent", color: "var(--steel-dark)", borderColor: "var(--sand-dark)" }}
            >
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div className="w-px h-4 self-center" style={{ backgroundColor: "var(--sand-dark)" }} />
        {/* Status */}
        <div className="flex flex-wrap gap-1.5">
          {["all", ...Object.keys(STATUS_COLORS)].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-2.5 py-1 text-xs font-semibold rounded-full border transition-all duration-150"
              style={statusFilter === s
                ? { backgroundColor: STATUS_COLORS[s] || "var(--brand)", color: "#fff", borderColor: STATUS_COLORS[s] || "var(--brand)" }
                : { backgroundColor: "transparent", color: "var(--steel-dark)", borderColor: "var(--sand-dark)" }}
            >
              {s === "all" ? "All Status" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs" style={{ color: "var(--steel-dark)" }}>
          {loading ? "Loading…" : `${visibleTickets.length} ticket${visibleTickets.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Map */}
      <div
        className="relative rounded-2xl overflow-hidden border"
        style={{ height, borderColor: "var(--sand-dark)" }}
      >
        {loading && (
          <div
            className="absolute inset-0 z-[2000] flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
          >
            <div
              className="w-7 h-7 rounded-full border-4 animate-spin"
              style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }}
            />
          </div>
        )}

        <MapContainer
          center={userCoords || [18.5204, 73.8567]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          {userCoords && <FlyTo coords={userCoords} />}
          {!userCoords && visibleTickets.length > 0 && <FitBounds tickets={visibleTickets} />}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {visibleTickets.map((ticket) => (
            <Marker
              key={ticket._id}
              position={[ticket.location.lat, ticket.location.lng]}
              icon={makePin(ticket.status, countMap[ticket._id] ?? ticket.voteCount ?? 0)}
            >
              <Popup minWidth={230} maxWidth={270}>
                <div style={{ fontFamily: "inherit" }}>
                  {/* Category tag */}
                  {ticket.category && (
                    <p
                      className="text-xs font-semibold mb-1.5 uppercase tracking-wide"
                      style={{ color: "#94a3b8" }}
                    >
                      {ticket.category}
                    </p>
                  )}

                  {/* Title + Status */}
                  <div className="flex items-start gap-2 mb-2">
                    <p
                      className="font-bold text-sm leading-snug flex-1"
                      style={{ color: "#1e293b" }}
                    >
                      {ticket.title}
                    </p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0"
                      style={{
                        backgroundColor: (STATUS_COLORS[ticket.status] || "#64748b") + "22",
                        color: STATUS_COLORS[ticket.status] || "#64748b",
                      }}
                    >
                      {STATUS_LABELS[ticket.status] || ticket.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "#475569" }}>
                    {ticket.description?.slice(0, 120)}
                    {ticket.description?.length > 120 ? "…" : ""}
                  </p>

                  {/* Location address */}
                  {ticket.location?.address && (
                    <p className="text-xs mb-2" style={{ color: "#94a3b8" }}>
                      {ticket.location.address.split(",").slice(0, 3).join(",")}
                    </p>
                  )}

                  {/* Raised by + date + votes */}
                  <p className="text-xs mb-3" style={{ color: "#94a3b8" }}>
                    By {ticket.createdBy?.name || "Citizen"} ·{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                    {(ticket.voteCount ?? 0) > 0 && (
                      <span className="ml-2 font-semibold" style={{ color: "#1e3a5f" }}>
                        · {ticket.voteCount} {ticket.voteCount === 1 ? "vote" : "votes"}
                      </span>
                    )}
                  </p>

                  {/* Assigned official */}
                  {ticket.assignedTo && (
                    <p className="text-xs mb-2">
                      <span style={{ color: "#94a3b8" }}>Assigned: </span>
                      <span className="font-semibold" style={{ color: ticket.assignedTo.isActive === false ? "#dc2626" : "#1e293b" }}>
                        {ticket.assignedTo.name}
                      </span>
                      {ticket.assignedTo.isActive === false && (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: "#dc2626", color: "#fff" }}>
                          Blacklisted
                        </span>
                      )}
                    </p>
                  )}

                  {/* Proof image (official uploaded) */}
                  {ticket.proofImageUrl && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold mb-1" style={{ color: "#7c3aed" }}>
                        Work Proof
                      </p>
                      <img
                        src={ticket.proofImageUrl}
                        alt="Work proof"
                        style={{ width: "100%", borderRadius: 8, maxHeight: 120, objectFit: "cover", cursor: "pointer" }}
                        onClick={() => window.open(ticket.proofImageUrl, "_blank")}
                      />
                    </div>
                  )}
                  {/* AI proof review */}
                  {ticket.proofImageUrl && (
                    <div className="mb-2">
                      <ProofAiReview ticket={ticket} compact />
                    </div>
                  )}

                  {/* Rejection reason */}
                  {ticket.status === "rejected" && ticket.rejectionReason && (
                    <p className="text-xs mb-2 px-2 py-1 rounded" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                      Rejected: {ticket.rejectionReason}
                    </p>
                  )}

                  {/* Footer: vote + proof vote + link */}
                  <div
                    className="flex items-center justify-between pt-2 border-t"
                    style={{ borderColor: "#e2e8f0" }}
                  >
                    {/* Vote count — visible to all; vote button — citizens only */}
                    {isCitizen ? (
                      <button
                        onClick={(e) => handleVote(ticket._id, e)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                        style={
                          votedMap[ticket._id]
                            ? { backgroundColor: "#1e3a5f", color: "white", borderColor: "#1e3a5f" }
                            : { borderColor: "#cbd5e1", color: "#64748b", backgroundColor: "transparent" }
                        }
                      >
                        <svg width="10" height="10" viewBox="0 0 20 20"
                          fill={votedMap[ticket._id] ? "currentColor" : "none"}
                          stroke="currentColor" strokeWidth="2.5">
                          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                        </svg>
                        {countMap[ticket._id] ?? 0}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold" style={{ color: "#64748b" }}>
                        {countMap[ticket._id] ?? 0} {(countMap[ticket._id] ?? 0) === 1 ? "vote" : "votes"}
                      </span>
                    )}
                    <a href={`/tickets/${ticket._id}`} className="text-xs font-semibold" style={{ color: "#1e3a5f" }}>
                      View Details →
                    </a>
                  </div>

                  {/* Proof validation — citizens only, shown when proof_submitted */}
                  {isCitizen && ticket.status === "proof_submitted" && (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: "#e2e8f0" }}>
                      <p className="text-xs font-semibold mb-1.5" style={{ color: "#7c3aed" }}>
                        Is the work done? Validate the proof:
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleProofVote(ticket._id, "up", e)}
                          className="flex-1 py-1 rounded-lg text-xs font-bold border transition-all"
                          style={proofVoteMap[ticket._id] === "up"
                            ? { backgroundColor: "#15803d", color: "#fff", borderColor: "#15803d" }
                            : { borderColor: "#86efac", color: "#15803d", backgroundColor: "#f0fdf4" }}
                        >
                          Yes ({proofCountMap[ticket._id]?.up ?? 0})
                        </button>
                        <button
                          onClick={(e) => handleProofVote(ticket._id, "down", e)}
                          className="flex-1 py-1 rounded-lg text-xs font-bold border transition-all"
                          style={proofVoteMap[ticket._id] === "down"
                            ? { backgroundColor: "#dc2626", color: "#fff", borderColor: "#dc2626" }
                            : { borderColor: "#fca5a5", color: "#dc2626", backgroundColor: "#fef2f2" }}
                        >
                          No ({proofCountMap[ticket._id]?.down ?? 0})
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Non-citizen proof vote counts (read-only) */}
                  {!isCitizen && ticket.status === "proof_submitted" && (
                    <div className="mt-2 pt-2 border-t flex gap-3" style={{ borderColor: "#e2e8f0" }}>
                      <span className="text-xs font-semibold" style={{ color: "#15803d" }}>
                        {proofCountMap[ticket._id]?.up ?? 0} confirmed
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "#dc2626" }}>
                        {proofCountMap[ticket._id]?.down ?? 0} disputed
                      </span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* My Location FAB */}
        <button
          onClick={locateMe}
          className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-lg transition-all"
          style={{ backgroundColor: "var(--brand)", color: "var(--cream)" }}
          title="Center map on my location"
        >
          My Location
        </button>

        {/* Legend */}
        <div
          className="absolute top-3 left-3 z-[1000] rounded-xl px-3 py-2 flex flex-wrap gap-x-4 gap-y-1"
          style={{ backgroundColor: "rgba(255,255,255,0.95)", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}
        >
          {Object.entries(STATUS_COLORS).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1.5">
              <svg width="10" height="13" viewBox="0 0 36 44">
                <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill={c}/>
              </svg>
              <span className="text-xs font-medium" style={{ color: "#334155" }}>
                {STATUS_LABELS[s]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketMap;
