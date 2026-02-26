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
      enum: ["pending", "in_progress", "completed", "rejected"],
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
    votes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    voteCount: {
      type: Number,
      default: 0,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    votes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Index for geo queries
ticketSchema.index({ "location.lat": 1, "location.lng": 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Ticket", ticketSchema);
