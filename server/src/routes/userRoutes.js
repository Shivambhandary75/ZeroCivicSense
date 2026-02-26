const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  deactivateUser,
  getContractors,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/", restrictTo("admin"), getAllUsers);
router.get("/contractors", restrictTo("admin"), getContractors);
router.patch("/profile", updateProfile);
router.get("/:id", restrictTo("admin"), getUserById);
router.patch("/:id/deactivate", restrictTo("admin"), deactivateUser);

module.exports = router;
