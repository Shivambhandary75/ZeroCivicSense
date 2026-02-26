const axios = require("axios");
const Ticket = require("../models/Ticket");
const Verification = require("../models/Verification");
const logger = require("../utils/logger");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * Send ticket images to the AI microservice for analysis.
 * Falls back to mock values if AI service is unreachable (hackathon-safe).
 *
 * @param {string} ticketId
 * @param {boolean} hasProof - true if contractor uploaded a work proof image
 */
const analyzeTicket = async (ticketId, hasProof = false) => {
  try {
    await Verification.findOneAndUpdate(
      { ticketId },
      { status: "processing" },
      { upsert: true },
    );

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    let aiResult;

    try {
      const payload = {
        ticket_id: ticketId.toString(),
        image_url: ticket.imageUrl,
        proof_url: hasProof ? ticket.proofImageUrl : null,
      };

      const { data } = await axios.post(`${AI_SERVICE_URL}/analyze`, payload, {
        timeout: 30000,
      });

      aiResult = {
        aiScore: data.ai_score,
        tamperFlag: data.tamper_flag,
        progressEstimate: data.progress_estimate,
        similarityIndex: data.similarity_index,
        aiRawResponse: data,
      };
    } catch (aiError) {
      logger.warn(
        `AI service unreachable. Using mock data for ticket ${ticketId}`,
      );
      // Mock fallback — useful for hackathon demo
      aiResult = {
        aiScore: Math.floor(Math.random() * 40 + 60), // 60-100
        tamperFlag: Math.random() < 0.1, // 10% chance
        progressEstimate: hasProof ? Math.floor(Math.random() * 30 + 60) : 0,
        similarityIndex: hasProof
          ? parseFloat((Math.random() * 0.4 + 0.6).toFixed(2))
          : null,
        aiRawResponse: { mock: true },
      };
    }

    await Verification.findOneAndUpdate(
      { ticketId },
      {
        ...aiResult,
        status: "done",
        analyzedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    logger.info(`AI analysis complete for ticket ${ticketId}`);
  } catch (err) {
    logger.error(`AI analysis failed for ticket ${ticketId}: ${err.message}`);
    await Verification.findOneAndUpdate(
      { ticketId },
      { status: "failed" },
      { upsert: true },
    );
  }
};

module.exports = { analyzeTicket };
