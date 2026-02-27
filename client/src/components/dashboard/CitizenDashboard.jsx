import React, { useEffect, useState } from "react";
import { getMyTickets, getPublicTickets, voteTicket, proofVoteTicket } from "../../services/ticketService";
import TicketCard from "../ticket/TicketCard";
import { ProofAiReview } from "../ticket/TicketCard";
import Loader from "../common/Loader";
import Button from "../common/Button";
import { ClipboardIcon, PlusIcon, MapPinIcon } from "../common/Icons";
import TicketMap from "../map/TicketMap";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["all", "road", "water", "electricity", "garbage", "drainage", "other"];

// ---------- Vote button ----------
const VoteButton = ({ ticket, onVoted }) => {
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(ticket.userVoted);
  const [count, setCount] = useState(ticket.voteCount ?? 0);

  const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await voteTicket(ticket._id);
      setVoted(res.voted);
      setCount(res.voteCount);
      if (onVoted) onVoted(ticket._id, res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
      style={voted
        ? { backgroundColor: "var(--brand)", color: "var(--cream)", borderColor: "var(--brand)" }
        : { backgroundColor: "transparent", color: "var(--steel-dark)", borderColor: "var(--sand-dark)" }}>
      <svg width="12" height="12" viewBox="0 0 20 20" fill={voted ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2">
        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
        <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
      </svg>
      {count > 0 ? count : "Upvote"}
    </button>
  );
};

// ---------- Proof Vote Bar ----------
const ProofVoteBar = ({ ticket, onProofVoted }) => {
  const [loading, setLoading] = useState(false);
  const [vote, setVote]   = useState(ticket.userProofVote || null);
  const [ups, setUps]     = useState(ticket.proofUpCount   ?? 0);
  const [downs, setDowns] = useState(ticket.proofDownCount ?? 0);

  const handleVote = async (dir, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await proofVoteTicket(ticket._id, dir);
      setVote(res.userProofVote);
      setUps(res.proofUpCount);
      setDowns(res.proofDownCount);
      if (onProofVoted) onProofVoted(ticket._id, res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-xs font-semibold" style={{ color: "#7c3aed" }}>Validate proof:</span>
      <button
        onClick={(e) => handleVote("up", e)}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 rounded-full border transition-all"
        style={vote === "up"
          ? { backgroundColor: "#7c3aed", color: "#fff", borderColor: "#7c3aed" }
          : { backgroundColor: "transparent", color: "#7c3aed", borderColor: "#c4b5fd" }}>
        Yes ({ups})
      </button>
      <button
        onClick={(e) => handleVote("down", e)}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 rounded-full border transition-all"
        style={vote === "down"
          ? { backgroundColor: "#dc2626", color: "#fff", borderColor: "#dc2626" }
          : { backgroundColor: "transparent", color: "#dc2626", borderColor: "#fca5a5" }}>
      No ({downs})
      </button>
    </div>
  );
};

// ---------- Community Board ----------
const CommunityBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("all");

  const fetchPublic = (cat) => {
    setLoading(true);
    const params = cat !== "all" ? { category: cat } : {};
    getPublicTickets(params)
      .then(setTickets)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPublic(catFilter); }, [catFilter]);

  const handleVoteUpdate = (ticketId, res) => {
    setTickets((prev) =>
      prev.map((t) =>
        t._id === ticketId ? { ...t, voteCount: res.voteCount, userVoted: res.voted } : t,
      ),
    );
  };

  const handleProofVoteUpdate = (ticketId, res) => {
    setTickets((prev) =>
      prev.map((t) =>
        t._id === ticketId
          ? { ...t, userProofVote: res.userProofVote, proofUpCount: res.proofUpCount, proofDownCount: res.proofDownCount }
          : t,
      ),
    );
  };

  return (
    <div className="space-y-4">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCatFilter(c)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full border transition-all"
            style={catFilter === c
              ? { backgroundColor: "var(--brand)", color: "var(--cream)", borderColor: "var(--brand)" }
              : { backgroundColor: "transparent", color: "var(--steel-dark)", borderColor: "var(--sand-dark)" }}>
            {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : tickets.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border"
          style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}>
          <p className="text-sm" style={{ color: "var(--steel-dark)" }}>No community tickets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <div key={ticket._id}>
              <TicketCard ticket={ticket} />
              {/* Proof image */}
              {ticket.proofImageUrl && (
                <div className="mt-2">
                  <p className="text-xs font-semibold mb-1 px-1" style={{ color: "#7c3aed" }}>Work Proof</p>
                  <img
                    src={ticket.proofImageUrl}
                    alt="Work proof"
                    onClick={() => window.open(ticket.proofImageUrl, "_blank")}
                    style={{ width: "100%", borderRadius: 8, maxHeight: 140, objectFit: "cover", cursor: "pointer" }}
                  />
                </div>
              )}
              {/* AI proof review */}
              {ticket.proofImageUrl && <div className="mt-1"><ProofAiReview ticket={ticket} /></div>}
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--steel-dark)" }}>
                  <MapPinIcon size={11} />
                  <span>{ticket.location?.address || `${ticket.location?.lat?.toFixed(3)}, ${ticket.location?.lng?.toFixed(3)}`}</span>
                </div>
                <VoteButton ticket={ticket} onVoted={handleVoteUpdate} />
              </div>
              {ticket.status === "proof_submitted" && (
                <div className="mt-2 px-1">
                  <ProofVoteBar ticket={ticket} onProofVoted={handleProofVoteUpdate} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Main CitizenDashboard ----------
const CitizenDashboard = () => {
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my"); // "my" | "community"
  const navigate = useNavigate();

  useEffect(() => {
    getMyTickets()
      .then(setMyTickets)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold" style={{ color: "var(--brand)" }}>
          {activeTab === "my" ? "My Tickets" : "Community Board"}
        </h2>
        <Button onClick={() => navigate("/raise-ticket")}>
          <PlusIcon size={14} style={{ display: "inline", marginRight: 6 }} />
          Raise Ticket
        </Button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-3 border-b" style={{ borderColor: "var(--sand-dark)" }}>
        {[["my", "My Tickets"], ["community", "Community Board"], ["map", "Map View"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="pb-2 text-sm font-semibold transition-all border-b-2"
            style={activeTab === key
              ? { color: "var(--brand)", borderColor: "var(--brand)" }
              : { color: "var(--steel-dark)", borderColor: "transparent" }}>
            {label}
          </button>
        ))}
      </div>

      {/* My Tickets tab */}
      {activeTab === "my" && (
        loading ? (
          <Loader />
        ) : myTickets.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border"
            style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "var(--cream)", color: "var(--steel-dark)" }}
            >
              <ClipboardIcon size={28} />
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--steel-dark)" }}>
              You haven&apos;t raised any tickets yet.
            </p>
            <Button onClick={() => navigate("/raise-ticket")}>Raise Your First Ticket</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )
      )}

      {/* Community Board tab */}
      {activeTab === "community" && <CommunityBoard />}

      {/* Map View tab */}
      {activeTab === "map" && <TicketMap height="520px" />}
    </div>
  );
};

export default CitizenDashboard;
