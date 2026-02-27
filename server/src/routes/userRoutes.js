const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  deactivateUser,
  reactivateUser,
  getContractors,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

router.use(protect);

router.get(
  "/contractors",
  restrictTo("contractor", "authority"),
  getContractors,
);
router.get("/", restrictTo("authority"), getAllUsers);
router.get("/contractors", restrictTo("authority"), getContractors);
router.patch("/profile", updateProfile);
router.get("/:id", restrictTo("authority"), getUserById);
router.patch("/:id/deactivate", restrictTo("authority"), deactivateUser);
router.patch("/:id/reactivate", restrictTo("authority"), reactivateUser);

module.exports = router;
