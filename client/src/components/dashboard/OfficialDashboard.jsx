import React, { useEffect, useState, useCallback } from "react";
import {
  getOpenTickets,
  getOfficialTickets,
  pickTicket,
  assignContractor,
} from "../../services/ticketService";
import { getContractors } from "../../services/userService";
import TicketCard from "../ticket/TicketCard";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { GavelIcon, BriefcaseIcon, ClipboardIcon, MapIcon } from "../common/Icons";
import TicketMap from "../map/TicketMap";

const TABS = [
  { key: "open", label: "Open Tickets", Icon: ClipboardIcon },
  { key: "mine", label: "My Endorsed",  Icon: GavelIcon },
  { key: "map",  label: "Map View",     Icon: MapIcon },
];

const STAT_COLORS = [
  { bg: "var(--brand)", color: "var(--cream)" },
  { bg: "#b45309",      color: "#ffffff"      },
  { bg: "#1d4ed8",      color: "#ffffff"      },
  { bg: "#15803d",      color: "#ffffff"      },
];

const OfficialDashboard = () => {
  const [tab, setTab] = useState("open");
  const [openTickets, setOpenTickets]   = useState([]);
  const [myTickets, setMyTickets]       = useState([]);
  const [contractors, setContractors]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [actionTicket, setActionTicket] = useState(null); // ticket being acted on
  const [actionType, setActionType]     = useState(null); // "pick" | "assign"
  const [selectedContractor, setSelectedContractor] = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  const stats = [
    { label: "Open",        value: openTickets.length },
    { label: "My Endorsed", value: myTickets.length },
    { label: "Assigned",    value: myTickets.filter((t) => t.assignedTo).length },
    { label: "Completed",   value: myTickets.filter((t) => t.status === "completed").length },
  ];

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [open, mine, ctrs] = await Promise.all([
        getOpenTickets(),
        getOfficialTickets(),
        getContractors(),
      ]);
      setOpenTickets(open);
      setMyTickets(mine);
      setContractors(ctrs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openPickModal = (ticket) => {
    setActionTicket(ticket);
    setActionType("pick");
    setError("");
  };

  const openAssignModal = (ticket) => {
    setActionTicket(ticket);
    setActionType("assign");
    setSelectedContractor("");
    setError("");
  };

  const closeModal = () => {
    setActionTicket(null);
    setActionType(null);
    setError("");
  };

  const handlePick = async () => {
    try {
      setSubmitting(true);
      setError("");
      await pickTicket(actionTicket._id);
      closeModal();
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to pick ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedContractor) { setError("Please select a contractor."); return; }
    try {
      setSubmitting(true);
      setError("");
      await assignContractor(actionTicket._id, selectedContractor);
      closeModal();
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to assign contractor.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentTickets = tab === "open" ? openTickets : tab === "mine" ? myTickets : [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ backgroundColor: "var(--sand-light)", border: "1px solid var(--sand-dark)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm"
              style={{ backgroundColor: STAT_COLORS[i].bg, color: STAT_COLORS[i].color }}
            >
              {s.value}
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--brand)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: "var(--sand-dark)" }}>
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 -mb-px"
            style={
              tab === key
                ? { borderColor: "var(--brand)", color: "var(--brand)" }
                : { borderColor: "transparent", color: "var(--steel-dark)" }
            }
          >
            <Icon size={14} />
            {label}
            {key !== "map" && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={
                  tab === key
                    ? { backgroundColor: "var(--brand)", color: "var(--cream)" }
                    : { backgroundColor: "var(--sand)", color: "var(--steel-dark)" }
                }
              >
                {key === "open" ? openTickets.length : myTickets.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      {tab !== "map" && (loading ? (
        <Loader />
      ) : currentTickets.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border"
          style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--cream)", color: "var(--steel-dark)" }}
          >
            <GavelIcon size={28} />
          </div>
          <p className="text-sm" style={{ color: "var(--steel-dark)" }}>
            {tab === "open" ? "No open tickets at the moment." : "You haven't endorsed any tickets yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTickets.map((ticket) => (
            <div key={ticket._id}>
              <TicketCard ticket={ticket} />
              <div className="flex gap-2 mt-2">
                {tab === "open" && (
                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => openPickModal(ticket)}
                  >
                    <GavelIcon size={12} style={{ display: "inline", marginRight: 5 }} />
                    Endorse & Begin Work
                  </Button>
                )}
                {tab === "mine" && !ticket.assignedTo && (
                  <Button
                    size="sm"
                    variant="outline"
                    fullWidth
                    onClick={() => openAssignModal(ticket)}
                  >
                    <BriefcaseIcon size={12} style={{ display: "inline", marginRight: 5 }} />
                    Assign Contractor
                  </Button>
                )}
                {tab === "mine" && ticket.assignedTo && (
                  <p className="text-xs w-full text-center py-2 rounded-xl font-semibold"
                    style={{ backgroundColor: "var(--sand)", color: "var(--brand)" }}>
                    Contractor: {ticket.assignedTo?.name || "Assigned"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Map View */}
      {tab === "map" && <TicketMap height="520px" />}

      {/* Pick confirmation modal */}
      <Modal
        isOpen={actionType === "pick" && !!actionTicket}
        onClose={closeModal}
        title="Endorse & Begin Work"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--steel-dark)" }}>
            You are about to endorse and begin work on:
          </p>
          <div
            className="rounded-xl p-3 border"
            style={{ backgroundColor: "var(--cream)", borderColor: "var(--sand-dark)" }}
          >
            <p className="font-semibold text-sm" style={{ color: "var(--brand)" }}>
              {actionTicket?.title}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--steel-dark)" }}>
              {actionTicket?.description?.slice(0, 100)}…
            </p>
          </div>
          <p className="text-xs" style={{ color: "var(--steel-dark)" }}>
            This will mark the ticket as <strong>In Progress</strong> and assign it to you. You can then assign a contractor.
          </p>
          {error && (
            <p className="text-xs px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>{error}</p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={closeModal}>Cancel</Button>
            <Button fullWidth loading={submitting} onClick={handlePick}>Confirm</Button>
          </div>
        </div>
      </Modal>

      {/* Assign contractor modal */}
      <Modal
        isOpen={actionType === "assign" && !!actionTicket}
        onClose={closeModal}
        title="Assign Contractor"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--steel-dark)" }}>
            Assign a contractor for:{" "}
            <span className="font-semibold" style={{ color: "var(--brand)" }}>
              {actionTicket?.title}
            </span>
          </p>
          {contractors.length === 0 ? (
            <p className="text-xs py-3 text-center" style={{ color: "var(--steel-dark)" }}>
              No registered contractors available.
            </p>
          ) : (
            <select
              value={selectedContractor}
              onChange={(e) => setSelectedContractor(e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: "var(--cream)",
                border: "1.5px solid var(--sand-dark)",
                color: "var(--brand)",
              }}
            >
              <option value="">— Select a contractor —</option>
              {contractors.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.email ? `(${c.email})` : ""}
                </option>
              ))}
            </select>
          )}
          {error && (
            <p className="text-xs px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>{error}</p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={closeModal}>Cancel</Button>
            <Button fullWidth loading={submitting} onClick={handleAssign}>
              Assign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OfficialDashboard;
