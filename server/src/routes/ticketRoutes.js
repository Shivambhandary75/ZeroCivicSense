const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getMyTickets,
  getAssignedTickets,
  getOpenTickets,
  getOfficialTickets,
  getTicketById,
  updateTicketStatus,
  uploadWorkProof,
  deleteTicket,
  assignTicket,
  selfPickTicket,
  pickTicket,
  assignContractor,
  voteTicket,
  proofVoteTicket,
  getPublicTickets,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

router.use(protect); // All ticket routes are protected

router.post("/", restrictTo("citizen"), upload.single("image"), createTicket);
router.get("/", restrictTo("authority"), getAllTickets);
router.get("/my", restrictTo("citizen"), getMyTickets);
router.get("/assigned", restrictTo("contractor"), getAssignedTickets);
router.get("/open", restrictTo("contractor", "official"), getOpenTickets);
router.get("/official", restrictTo("official"), getOfficialTickets);
router.get("/public", getPublicTickets); // all roles
router.get("/:id", getTicketById);
router.patch("/:id/status", restrictTo("authority"), updateTicketStatus);
router.patch("/:id/assign", restrictTo("authority"), assignTicket);
router.patch("/:id/self-pick", restrictTo("contractor"), selfPickTicket);
router.patch("/:id/pick", restrictTo("official"), pickTicket);
router.patch(
  "/:id/assign-contractor",
  restrictTo("official"),
  assignContractor,
);
router.patch("/:id/vote", restrictTo("citizen"), voteTicket); // citizens upvote issues
router.patch("/:id/proof-vote", restrictTo("citizen"), proofVoteTicket); // citizens validate proof
router.post(
  "/:id/proof",
  restrictTo("contractor"), // contractor = government official role
  upload.single("proof"),
  uploadWorkProof,
);
router.delete("/:id", restrictTo("citizen"), deleteTicket);

module.exports = router;
