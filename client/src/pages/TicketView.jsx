import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById } from "../services/ticketService";
import TicketDetails from "../components/ticket/TicketDetails";
import Loader from "../components/common/Loader";
import { ArrowLeftIcon } from "../components/common/Icons";

const TicketView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTicketById(id)
      .then(setTicket)
      .catch(() => setError("Ticket not found or you don't have access."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--brand)" }}
      >
        <ArrowLeftIcon size={14} /> Back
      </button>

      {loading ? (
        <Loader />
      ) : error ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{ color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
        >
          {error}
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}
        >
          <TicketDetails ticket={ticket} />
        </div>
      )}
    </div>
  );
};

export default TicketView;
