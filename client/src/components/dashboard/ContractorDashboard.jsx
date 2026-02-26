import React, { useEffect, useState } from "react";
import { getAssignedTickets, uploadWorkProof } from "../../services/ticketService";
import TicketCard from "../ticket/TicketCard";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { HardHatIcon, UploadIcon } from "../common/Icons";

const ContractorDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getAssignedTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!proofFile || !selected) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("proof", proofFile);
      await uploadWorkProof(selected._id, formData);
      setSelected(null);
      fetchTickets();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold" style={{ color: "var(--brand)" }}>My Assigned Work</h2>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: "var(--sand)", color: "var(--brand)" }}
        >
          {tickets.length} tasks
        </span>
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
            <HardHatIcon size={28} />
          </div>
          <p className="text-sm" style={{ color: "var(--steel-dark)" }}>No tasks assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <div key={ticket._id}>
              <TicketCard ticket={ticket} />
              <Button variant="outline" fullWidth className="mt-2" onClick={() => setSelected(ticket)}>
                <UploadIcon size={13} style={{ display: "inline", marginRight: 6 }} />
                Upload Work Proof
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Upload Work Proof" size="sm">
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--steel-dark)" }}>
            Upload a photo of completed work for:{" "}
            <span className="font-semibold" style={{ color: "var(--brand)" }}>{selected?.title}</span>
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProofFile(e.target.files[0])}
            className="block w-full text-sm"
            style={{ color: "var(--steel-dark)" }}
          />
          <Button fullWidth loading={uploading} onClick={handleUpload}>
            Submit Proof
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ContractorDashboard;
