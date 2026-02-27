const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["road", "water", "electricity", "garbage", "drainage", "other"],
      default: "other",
    },
    status: {
      type: String,
      // proof_submitted = official uploaded proof, awaiting citizen validation
      enum: [
        "pending",
        "in_progress",
        "proof_submitted",
        "completed",
        "rejected",
      ],
      default: "pending",
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, default: "" },
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    proofImageUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    officialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    contractorNote: {
      type: String,
      default: "",
    },
    // ── Ticket upvotes (citizen interest signal) ─────────────────────────────
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    voteCount: { type: Number, default: 0 },
    // ── Proof validation votes (citizens validate official's work proof) ──────
    proofUpvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    proofDownvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    proofUpCount: { type: Number, default: 0 },
    proofDownCount: { type: Number, default: 0 },
    // ── Rejection reason (required when authority rejects) ───────────────────
    rejectionReason: { type: String, default: "" },
    // ── AI review of official's uploaded proof ───────────────────────────────
    proofAiStatus: {
      type: String,
      enum: ["pending", "processing", "done", "failed"],
      default: "pending",
    },
    proofAiScore: { type: Number, default: null }, // 0-100
    proofAiTamper: { type: Boolean, default: false },
    proofAiProgress: { type: Number, default: null }, // 0-100 work completion %
    proofAiVerdict: { type: String, default: "" }, // "authentic" | "suspicious" | "inconclusive"
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Index for geo queries
ticketSchema.index({ "location.lat": 1, "location.lng": 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Ticket", ticketSchema);
