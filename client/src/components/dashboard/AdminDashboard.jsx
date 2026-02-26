import React, { useEffect, useState } from "react";
import { getAllTickets, updateTicketStatus } from "../../services/ticketService";
import TicketCard from "../ticket/TicketCard";
import Loader from "../common/Loader";
import Button from "../common/Button";

const STAT_COLORS = [
  { bg: "var(--brand)",   color: "var(--cream)"  },
  { bg: "#b45309",        color: "#ffffff"        },
  { bg: "#1d4ed8",        color: "#ffffff"        },
  { bg: "#15803d",        color: "#ffffff"        },
];

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="success" onClick={() => handleStatusUpdate(ticket._id, "completed")}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(ticket._id, "rejected")}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
