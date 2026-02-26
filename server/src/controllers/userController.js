const User = require("../models/User");

// @desc  Get all users (admin)
// @route GET /api/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc  Get user by ID (admin)
// @route GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc  Update user profile (self)
// @route PATCH /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true },
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc  Deactivate user (admin)
// @route PATCH /api/users/:id/deactivate
exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deactivated.", user });
  } catch (err) {
    next(err);
  }
};
