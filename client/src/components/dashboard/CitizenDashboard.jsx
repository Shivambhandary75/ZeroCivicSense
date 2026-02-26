import React, { useEffect, useState } from "react";
import { getMyTickets } from "../../services/ticketService";
import TicketCard from "../ticket/TicketCard";
import Loader from "../common/Loader";
import Button from "../common/Button";
import { ClipboardIcon, PlusIcon } from "../common/Icons";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold" style={{ color: "var(--brand)" }}>My Tickets</h2>
        <Button onClick={() => navigate("/raise-ticket")}>
          <PlusIcon size={14} style={{ display: "inline", marginRight: 6 }} />
          Raise Ticket
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : tickets.length === 0 ? (
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
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
