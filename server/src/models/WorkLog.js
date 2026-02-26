const mongoose = require("mongoose");

/**
 * Each entry represents a progress update logged by the contractor.
 * Multiple logs can exist per ticket, forming a timeline.
 */
const workLogSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // What stage of work is this log entry for
    stage: {
      type: String,
      enum: [
        "site_inspection",    // Initial visit, assessment
        "procurement",        // Acquiring materials / permits
        "groundwork",         // Digging, prep, demolition
        "active_work",        // Core work underway
        "quality_check",      // Inspection / testing
        "work_completed",     // Job fully done
      ],
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description of work done is required"],
      trim: true,
    },
    proofImageUrl: {
      type: String,
      default: "",
    },
    proofImagePublicId: {
      type: String,
      default: "",
    },
    // AI analysis result attached to this specific proof image
    aiResult: {
      aiScore:           { type: Number, default: null },
      tamperFlag:        { type: Boolean, default: false },
      progressEstimate:  { type: Number, default: null },
      similarityIndex:   { type: Number, default: null },
      status:            { type: String, enum: ["pending", "processing", "done", "failed"], default: "pending" },
      analyzedAt:        { type: Date,   default: null },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WorkLog", workLogSchema);
