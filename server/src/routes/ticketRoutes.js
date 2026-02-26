const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getMyTickets,
  getAssignedTickets,
  getTicketById,
  updateTicketStatus,
  uploadWorkProof,
  deleteTicket,
  assignTicket,
  voteTicket,
  getPublicTickets,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

router.use(protect); // All ticket routes are protected

router.post("/", restrictTo("citizen"), upload.single("image"), createTicket);
router.get("/", restrictTo("admin"), getAllTickets);
router.get("/my", restrictTo("citizen"), getMyTickets);
router.get("/assigned", restrictTo("contractor"), getAssignedTickets);
router.get("/public", getPublicTickets);          // all roles
router.get("/:id", getTicketById);
router.patch("/:id/status", restrictTo("admin"), updateTicketStatus);
router.patch("/:id/assign", restrictTo("admin"), assignTicket);
router.patch("/:id/vote", voteTicket);             // all roles
router.post(
  "/:id/proof",
  restrictTo("contractor"),
  upload.single("proof"),
  uploadWorkProof,
);
router.delete("/:id", restrictTo("citizen"), deleteTicket);

module.exports = router;
