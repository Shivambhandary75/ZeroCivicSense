import React, { useEffect, useState } from "react";
import {
  getAllTickets,
  updateTicketStatus,
  assignTicket,
  getContractors,
} from "../../services/ticketService";
import TicketCard from "../ticket/TicketCard";
import Loader from "../common/Loader";
import Button from "../common/Button";

const STAT_COLORS = [
  { bg: "var(--brand)",   color: "var(--cream)"  },
  { bg: "#b45309",        color: "#ffffff"        },
  { bg: "#1d4ed8",        color: "#ffffff"        },
  { bg: "#15803d",        color: "#ffffff"        },
];

const DEPARTMENTS = ["All", "PWD", "Water Works", "Electricity Board", "Sanitation", "Drainage", "Other"];

// ---------- Assign Modal ----------
const AssignModal = ({ ticket, onClose, onAssigned }) => {
  const [deptFilter, setDeptFilter] = useState("All");
  const [contractors, setContractors] = useState([]);
  const [loadingC, setLoadingC] = useState(true);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    setLoadingC(true);
    getContractors(deptFilter === "All" ? undefined : deptFilter)
      .then(setContractors)
      .finally(() => setLoadingC(false));
  }, [deptFilter]);

  const handleAssign = async (contractorId) => {
    setAssigning(contractorId);
    try {
      await assignTicket(ticket._id, contractorId);
      onAssigned();
      onClose();
    } finally {
      setAssigning(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--cream)" }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: "var(--brand)", color: "var(--cream)" }}>
          <div>
            <p className="text-xs opacity-70">Assign Ticket</p>
            <h3 className="font-extrabold text-sm leading-snug">{ticket.title}</h3>
          </div>
          <button onClick={onClose} className="text-xl leading-none opacity-70 hover:opacity-100">&times;</button>
        </div>

        {/* Dept filter */}
        <div className="px-6 pt-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--steel-dark)" }}>Filter by Department</p>
          <div className="flex flex-wrap gap-1.5">
            {DEPARTMENTS.map((d) => (
              <button key={d} onClick={() => setDeptFilter(d)}
                className="px-3 py-1 text-xs font-semibold rounded-full border transition-all"
                style={deptFilter === d
                  ? { backgroundColor: "var(--brand)", color: "var(--cream)", borderColor: "var(--brand)" }
                  : { backgroundColor: "transparent", color: "var(--steel-dark)", borderColor: "var(--sand-dark)" }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Contractor list */}
        <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-2">
          {loadingC ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--steel-dark)" }}>Loading contractors…</p>
          ) : contractors.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--steel-dark)" }}>No contractors found in this department.</p>
          ) : (
            contractors.map((c) => (
              <div key={c._id}
                className="flex items-center justify-between rounded-xl px-4 py-3 border"
                style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--brand)" }}>{c.name}</p>
                  <p className="text-xs" style={{ color: "var(--steel-dark)" }}>{c.department} · {c.email}</p>
                </div>
                <Button size="sm"
                  onClick={() => handleAssign(c._id)}
                  disabled={assigning === c._id}>
                  {assigning === c._id ? "Assigning…" : "Assign"}
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="px-6 pb-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

// ---------- Contractors Tab ----------
const ContractorsTab = () => {
  const [deptFilter, setDeptFilter] = useState("All");
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getContractors(deptFilter === "All" ? undefined : deptFilter)
      .then(setContractors)
      .finally(() => setLoading(false));
  }, [deptFilter]);

  return (
    <div className="space-y-4">
      {/* Dept filter */}
      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((d) => (
          <button key={d} onClick={() => setDeptFilter(d)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full border transition-all"
            style={deptFilter === d
              ? { backgroundColor: "var(--brand)", color: "var(--cream)", borderColor: "var(--brand)" }
              : { backgroundColor: "transparent", color: "var(--steel-dark)", borderColor: "var(--sand-dark)" }}>
            {d}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        contractors.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border"
            style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}>
            <p className="text-sm" style={{ color: "var(--steel-dark)" }}>No contractors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contractors.map((c) => (
              <div key={c._id}
                className="rounded-2xl p-4 border flex flex-col gap-2"
                style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm"
                    style={{ backgroundColor: "var(--brand)", color: "var(--cream)" }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--brand)" }}>{c.name}</p>
                    <p className="text-xs" style={{ color: "var(--steel-dark)" }}>{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: "var(--cream)", color: "var(--brand)", border: "1px solid var(--sand-dark)" }}>
                    {c.department}
                  </span>
                  {c.phone && (
                    <span className="text-xs" style={{ color: "var(--steel-dark)" }}>{c.phone}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

// ---------- Main AdminDashboard ----------
const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("tickets"); // "tickets" | "contractors"
  const [assignTarget, setAssignTarget] = useState(null); // ticket being assigned

  const stats = [
    { label: "Total",       value: tickets.length },
    { label: "Pending",     value: tickets.filter((t) => t.status === "pending").length },
    { label: "In Progress", value: tickets.filter((t) => t.status === "in_progress").length },
    { label: "Completed",   value: tickets.filter((t) => t.status === "completed").length },
  ];

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await updateTicketStatus(id, status);
    fetchTickets();
  };

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

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

      {/* Tab switcher */}
      <div className="flex gap-3 border-b" style={{ borderColor: "var(--sand-dark)" }}>
        {[["tickets", "All Tickets"], ["contractors", "Contractor List"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="pb-2 text-sm font-semibold transition-all border-b-2"
            style={activeTab === key
              ? { color: "var(--brand)", borderColor: "var(--brand)" }
              : { color: "var(--steel-dark)", borderColor: "transparent" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tickets tab */}
      {activeTab === "tickets" && (
        <>
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "in_progress", "completed", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150"
                style={
                  filter === f
                    ? { backgroundColor: "var(--brand)", color: "var(--cream)", borderColor: "var(--brand)" }
                    : { backgroundColor: "transparent", color: "var(--steel-dark)", borderColor: "var(--sand-dark)" }
                }
              >
                {f.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tickets */}
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((ticket) => (
                <div key={ticket._id}>
                  <TicketCard ticket={ticket} />
                  {/* Assigned badge */}
                  {ticket.assignedTo && (
                    <p className="text-xs mt-1 px-1" style={{ color: "var(--steel-dark)" }}>
                      Assigned to: <span className="font-semibold" style={{ color: "var(--brand)" }}>{ticket.assignedTo.name}</span>
                      {ticket.assignedTo.department ? ` (${ticket.assignedTo.department})` : ""}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Button size="sm" variant="success" onClick={() => handleStatusUpdate(ticket._id, "completed")}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(ticket._id, "rejected")}>Reject</Button>
                    <Button size="sm" onClick={() => setAssignTarget(ticket)}>Assign Contractor</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Contractors tab */}
      {activeTab === "contractors" && <ContractorsTab />}

      {/* Assign modal */}
      {assignTarget && (
        <AssignModal
          ticket={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={fetchTickets}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
