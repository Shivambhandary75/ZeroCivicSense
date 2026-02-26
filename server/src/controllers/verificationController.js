const Verification = require("../models/Verification");
const Ticket = require("../models/Ticket");
const aiService = require("../services/aiService");

// @desc  Get verification for a ticket
// @route GET /api/verification/:ticketId
exports.getVerification = async (req, res, next) => {
  try {
    const verification = await Verification.findOne({
      ticketId: req.params.ticketId,
    });
    if (!verification)
      return res.status(404).json({ message: "Verification not found." });
    res.json(verification);
  } catch (err) {
    next(err);
  }
};

// @desc  Trigger AI re-analysis
// @route POST /api/verification/:ticketId/analyze
exports.triggerAnalysis = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    await Verification.findOneAndUpdate(
      { ticketId: ticket._id },
      { status: "processing" },
      { upsert: true },
    );

    aiService
      .analyzeTicket(ticket._id, !!ticket.proofImageUrl)
      .catch(console.error);

    res.json({ message: "AI analysis triggered." });
  } catch (err) {
    next(err);
  }
};

// @desc  Submit crowd vote
// @route POST /api/verification/:ticketId/vote
exports.submitVote = async (req, res, next) => {
  try {
    const { vote } = req.body; // "approved" | "rejected"

    if (!["approved", "rejected"].includes(vote)) {
      return res
        .status(400)
        .json({ message: "Vote must be 'approved' or 'rejected'." });
    }

    const verification = await Verification.findOneAndUpdate(
      { ticketId: req.params.ticketId },
      { $inc: { [`crowdVotes.${vote}`]: 1 } },
      { new: true },
    );

    if (!verification)
      return res.status(404).json({ message: "Verification not found." });

    res.json(verification);
  } catch (err) {
    next(err);
  }
};
