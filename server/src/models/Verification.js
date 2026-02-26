const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      unique: true,
    },
    aiScore: {
      type: Number, // 0-100
      default: null,
    },
    tamperFlag: {
      type: Boolean,
      default: false,
    },
    progressEstimate: {
      type: Number, // 0-100
      default: null,
    },
    similarityIndex: {
      type: Number, // 0-1
      default: null,
    },
    crowdVotes: {
      approved: { type: Number, default: 0 },
      rejected: { type: Number, default: 0 },
    },
    aiRawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    analyzedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "done", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Verification", verificationSchema);
