const express = require("express");
const router = express.Router();
const {
  getVerification,
  triggerAnalysis,
  submitVote,
} = require("../controllers/verificationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/:ticketId", getVerification);
router.post("/:ticketId/analyze", triggerAnalysis);
router.post("/:ticketId/vote", submitVote);

module.exports = router;
