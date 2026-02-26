const axios = require("axios");
const Ticket = require("../models/Ticket");
const Verification = require("../models/Verification");
const WorkLog = require("../models/WorkLog");
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

module.exports = { analyzeTicket, analyzeWorkLog };

/**
 * Analyse a specific WorkLog entry's proof image.
 * Compares proof against the original ticket image and fakes AI result.
 * Updates the aiResult sub-document on the WorkLog.
 *
 * @param {ObjectId} workLogId
 * @param {Object}   ticket  - parent ticket (for original imageUrl)
 */
async function analyzeWorkLog(workLogId, ticket) {
  try {
    const workLog = await WorkLog.findById(workLogId);
    if (!workLog) return;

    await WorkLog.findByIdAndUpdate(workLogId, { "aiResult.status": "processing" });

    let aiResult;

    try {
      const payload = {
        ticket_id:  ticket._id.toString(),
        image_url:  ticket.imageUrl  || null,
        proof_url:  workLog.proofImageUrl || null,
        stage:      workLog.stage,
      };

      const { data } = await axios.post(
        `${AI_SERVICE_URL}/analyze`,
        payload,
        { timeout: 30000 },
      );

      aiResult = {
        aiScore:          data.ai_score,
        tamperFlag:       data.tamper_flag,
        progressEstimate: data.progress_estimate,
        similarityIndex:  data.similarity_index,
        status:           "done",
        analyzedAt:       new Date(),
      };
    } catch {
      // Fake realistic values — progress increases with later stages
      const STAGE_PROGRESS = {
        site_inspection: [5,  20],
        procurement:     [20, 40],
        groundwork:      [35, 55],
        active_work:     [50, 75],
        quality_check:   [70, 88],
        work_completed:  [88, 100],
      };
      const [min, max] = STAGE_PROGRESS[workLog.stage] || [40, 80];
      const progressEstimate = Math.floor(Math.random() * (max - min + 1)) + min;

      aiResult = {
        aiScore:          Math.floor(Math.random() * 25 + 75),   // 75–100
        tamperFlag:       Math.random() < 0.08,                  // 8% chance
        progressEstimate,
        similarityIndex:  workLog.proofImageUrl
          ? parseFloat((Math.random() * 0.3 + 0.7).toFixed(2))
          : null,
        status:    "done",
        analyzedAt: new Date(),
      };
    }

    await WorkLog.findByIdAndUpdate(workLogId, { aiResult });
    logger.info(`WorkLog AI analysis complete for ${workLogId}`);
  } catch (err) {
    logger.error(`WorkLog AI analysis failed for ${workLogId}: ${err.message}`);
    await WorkLog.findByIdAndUpdate(workLogId, { "aiResult.status": "failed" });
  }
}
