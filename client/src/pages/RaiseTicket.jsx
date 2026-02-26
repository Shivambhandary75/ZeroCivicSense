import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketForm from "../components/ticket/TicketForm";
import Modal from "../components/common/Modal";
import { ArrowLeftIcon, CheckCircleIcon } from "../components/common/Icons";

const RaiseTicket = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10" style={{ minHeight: "100vh" }}>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-opacity hover:opacity-70"
          style={{ color: "var(--brand)" }}
        >
          <ArrowLeftIcon size={14} /> Back
        </button>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--brand)" }}>Raise a Ticket</h1>
        <p className="text-sm mt-1" style={{ color: "var(--steel-dark)" }}>
          Report a civic infrastructure issue in your area.
        </p>
      </div>

      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: "var(--sand-light)", borderColor: "var(--sand-dark)" }}
      >
        <TicketForm onSuccess={() => setSuccess(true)} />
      </div>

      <Modal isOpen={success} onClose={() => navigate("/dashboard")} title="Ticket Submitted!" size="sm">
        <div className="text-center space-y-4 py-2">
          <div className="flex justify-center" style={{ color: "#15803d" }}>
            <CheckCircleIcon size={48} />
          </div>
          <p className="text-sm" style={{ color: "var(--brand)" }}>
            Your ticket has been submitted successfully. Our AI will verify the
            issue and it will be visible to authorities.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 rounded-xl font-bold text-sm w-full transition-all duration-150"
            style={{ backgroundColor: "var(--brand)", color: "var(--cream)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--brand-dark)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--brand)"; }}
          >
            Go to Dashboard
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RaiseTicket;
