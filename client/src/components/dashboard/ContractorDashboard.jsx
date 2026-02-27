import React, { useEffect, useState, useCallback } from "react";
import {
  getAssignedTickets,
  getOpenTickets,
  uploadWorkProof,
  selfPickTicket,
} from "../../services/ticketService";
import TicketCard from "../ticket/TicketCard";
import { ProofAiReview } from "../ticket/TicketCard";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";
import {
  HardHatIcon,
  UploadIcon,
  ClipboardIcon,
  EyeIcon,
  PackageIcon,
  ShovelIcon,
  WrenchIcon,
  ClipboardCheckIcon,
  FlagIcon,
  MapIcon,
} from "../common/Icons";
import TicketMap from "../map/TicketMap";

const WORK_STAGES = [
  { value: "site_inspection", label: "Site Inspection",   Icon: EyeIcon,            desc: "Initial visit and on-ground assessment" },
  { value: "procurement",     label: "Procurement",       Icon: PackageIcon,         desc: "Acquiring materials, permits or equipment" },
  { value: "groundwork",      label: "Groundwork",        Icon: ShovelIcon,          desc: "Digging, demolition or site preparation" },
  { value: "active_work",     label: "Active Work",       Icon: WrenchIcon,          desc: "Core repair / construction underway" },
  { value: "quality_check",   label: "Quality Check",     Icon: ClipboardCheckIcon,  desc: "Inspection, testing and verification" },
  { value: "work_completed",  label: "Work Completed",    Icon: FlagIcon,            desc: "Job fully done and ready for review" },
];

const TABS = [
  { key: "assigned",  label: "My Work",          Icon: HardHatIcon   },
  { key: "available", label: "Available Tickets", Icon: ClipboardIcon },
  { key: "map",       label: "Map View",          Icon: MapIcon },
];

const ContractorDashboard = () => {
  const [tab, setTab]               = useState("assigned");
  const [assigned, setAssigned]     = useState([]);
  const [available, setAvailable]   = useState([]);
  const [loading, setLoading]       = useState(true);

  // Upload proof modal state
  const [selected, setSelected]     = useState(null);
  const [stage, setStage]           = useState("");
  const [description, setDescription] = useState("");
  const [proofFile, setProofFile]   = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Self-pick modal state
  const [picking, setPicking]       = useState(null);
  const [pickLoading, setPickLoading] = useState(false);
  const [pickError, setPickError]   = useState("");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [a, o] = await Promise.all([getAssignedTickets(), getOpenTickets()]);
      setAssigned(a);
      setAvailable(o);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openUploadModal = (ticket) => {
    setSelected(ticket);
    setStage("");
    setDescription("");
    setProofFile(null);
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!stage)       { setUploadError("Please select a work stage."); return; }
    if (!description) { setUploadError("Please add a description of the work done."); return; }
    if (!proofFile)   { setUploadError("A proof photo is required to submit work."); return; }
    try {
      setUploading(true);
      setUploadError("");
      const formData = new FormData();
      formData.append("stage", stage);
      formData.append("description", description);
      if (proofFile) formData.append("proof", proofFile);
      await uploadWorkProof(selected._id, formData);
      setSelected(null);
      fetchAll();
    } catch (err) {
      setUploadError(err?.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSelfPick = async () => {
    if (!picking) return;
    try {
      setPickLoading(true);
      setPickError("");
      await selfPickTicket(picking._id);
      setPicking(null);
      fetchAll();
      setTab("assigned");
    } catch (err) {
      setPickError(err?.response?.data?.message || "Failed to pick ticket.");
    } finally {
      setPickLoading(false);
    }
  };

  const currentTickets = tab === "assigned" ? assigned : tab === "available" ? available : [];

  return (
    <div className="space-y-6">
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
                {key === "assigned" ? assigned.length : available.length}
              </span>
            )}
          </button>
        ))}
      </div>

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
            <HardHatIcon size={28} />
          </div>
          <p className="text-sm" style={{ color: "var(--steel-dark)" }}>
            {tab === "assigned"
              ? "No tasks assigned to you yet."
              : "No open tickets available to pick up."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTickets.map((ticket) => (
            <div key={ticket._id}>
              <TicketCard ticket={ticket} />
              {/* Proof image */}
              {ticket.proofImageUrl && (
                <div className="mt-2 px-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#7c3aed" }}>Submitted Proof</p>
                  <img
                    src={ticket.proofImageUrl}
                    alt="Work proof"
                    onClick={() => window.open(ticket.proofImageUrl, "_blank")}
                    style={{ width: "100%", borderRadius: 8, maxHeight: 140, objectFit: "cover", cursor: "pointer" }}
                  />
                </div>
              )}
              {/* AI proof review */}
              {ticket.proofImageUrl && <div className="mt-1 px-1"><ProofAiReview ticket={ticket} /></div>}
              {/* Proof vote counts (visible to official after submitting proof) */}
              {ticket.status === "proof_submitted" && (
                <div className="mt-1 px-1 flex gap-3 text-xs">
                  <span style={{ color: "#15803d" }}>{ticket.proofUpCount ?? 0} confirmed</span>
                  <span style={{ color: "#dc2626" }}>{ticket.proofDownCount ?? 0} disputed</span>
                </div>
              )}
              {/* Rejection reason */}
              {ticket.status === "rejected" && ticket.rejectionReason && (
                <p className="mt-1 px-1 text-xs italic" style={{ color: "#dc2626" }}>
                  Rejected: {ticket.rejectionReason}
                </p>
              )}
              {tab === "assigned" ? (
                <Button
                  variant="outline"
                  fullWidth
                  className="mt-2"
                  onClick={() => openUploadModal(ticket)}
                >
                  <UploadIcon size={13} style={{ display: "inline", marginRight: 6 }} />
                  Upload Work Proof
                </Button>
              ) : (
                <Button
                  fullWidth
                  className="mt-2"
                  onClick={() => { setPicking(ticket); setPickError(""); }}
                >
                  <HardHatIcon size={13} style={{ display: "inline", marginRight: 6 }} />
                  Pick Up This Job
                </Button>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Map View */}
      {tab === "map" && <TicketMap height="520px" />}

      {/* â”€â”€ Log Progress Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Log Work Progress" size="md">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--steel-dark)" }}>
              Ticket
            </p>
            <p className="text-sm font-bold" style={{ color: "var(--brand)" }}>{selected?.title}</p>
          </div>

          {/* Stage picker */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--steel-dark)" }}>
              Work Stage <span style={{ color: "#dc2626" }}>*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {WORK_STAGES.map(({ value, label, Icon, desc }) => (
                <button
                  key={value}
                  onClick={() => setStage(value)}
                  className="flex items-start gap-2 p-3 rounded-xl border text-left transition-all duration-150"
                  style={
                    stage === value
                      ? { backgroundColor: "var(--brand)", color: "var(--cream)", borderColor: "var(--brand)" }
                      : { backgroundColor: "var(--cream)", color: "var(--brand)", borderColor: "var(--sand-dark)" }
                  }
                >
                  <Icon size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-bold leading-tight">{label}</p>
                    <p className="text-xs opacity-70 mt-0.5 leading-snug">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "var(--steel-dark)" }}>
              Description <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe what was done, materials used, issues encounteredâ€¦"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none border focus:ring-2"
              style={{
                backgroundColor: "var(--cream)",
                borderColor: "var(--sand-dark)",
                color: "var(--brand)",
              }}
            />
          </div>

          {/* Photo (required) */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "var(--steel-dark)" }}>
              Proof Photo <span style={{ color: "#dc2626" }}>* Required</span>
            </label>
            <p className="text-xs mb-1.5" style={{ color: "var(--steel-dark)" }}>Citizens will validate this photo to confirm the work is done.</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProofFile(e.target.files[0])}
              className="block w-full text-xs"
              style={{ color: "var(--steel-dark)" }}
            />
          </div>

          {uploadError && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
              {uploadError}
            </p>
          )}

          <Button fullWidth loading={uploading} onClick={handleUpload}>
            Submit Progress Log
          </Button>
        </div>
      </Modal>

      {/* â”€â”€ Self-pick modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Modal isOpen={!!picking} onClose={() => setPicking(null)} title="Pick Up This Job" size="sm">
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--steel-dark)" }}>
            You are volunteering to work on:
          </p>
          <div
            className="rounded-xl p-3 border"
            style={{ backgroundColor: "var(--cream)", borderColor: "var(--sand-dark)" }}
          >
            <p className="font-semibold text-sm" style={{ color: "var(--brand)" }}>
              {picking?.title}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--steel-dark)" }}>
              {picking?.description?.slice(0, 100)}â€¦
            </p>
          </div>
          <p className="text-xs" style={{ color: "var(--steel-dark)" }}>
            This ticket will be assigned to you. You can then log work progress once you begin.
          </p>
          {pickError && (
            <p className="text-xs px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>{pickError}</p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={() => setPicking(null)}>Cancel</Button>
            <Button fullWidth loading={pickLoading} onClick={handleSelfPick}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContractorDashboard;
