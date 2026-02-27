const Ticket = require("../models/Ticket");
const Verification = require("../models/Verification");
const AuditLog = require("../models/AuditLog");
const { uploadToCloudinary } = require("../config/cloudinary");
const aiService = require("../services/aiService");

// @desc  Create new ticket
// @route POST /api/tickets
exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, category, lat, lng, address } = req.body;

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "ZeroCivicSense/tickets",
      );
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: address || "",
      },
      imageUrl,
      imagePublicId,
      createdBy: req.user.id,
    });

    // Create a pending verification record
    await Verification.create({ ticketId: ticket._id });

    // Trigger AI analysis asynchronously
    aiService.analyzeTicket(ticket._id).catch(console.error);

    await AuditLog.create({
      userId: req.user.id,
      action: "CREATE_TICKET",
      resource: "Ticket",
      resourceId: ticket._id,
    });

    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

// @desc  Get all tickets (admin)
// @route GET /api/tickets
exports.getAllTickets = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email isActive department")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

// @desc  Get my tickets (citizen)
// @route GET /api/tickets/my
exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.id })
      .populate("assignedTo", "name isActive department")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

// @desc  Get assigned tickets (contractor)
// @route GET /api/tickets/assigned
exports.getAssignedTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

// @desc  Get open (unassigned pending) tickets (contractor/official)
// @route GET /api/tickets/open
exports.getOpenTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({
      status: "pending",
      assignedTo: { $exists: false },
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

// @desc  Contractor self-assigns to a ticket
// @route PATCH /api/tickets/:id/self-pick
exports.selfPickTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    if (ticket.assignedTo)
      return res.status(400).json({ message: "Ticket already assigned." });

    ticket.assignedTo = req.user.id;
    ticket.status = "in_progress";
    await ticket.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "SELF_PICK_TICKET",
      resource: "Ticket",
      resourceId: ticket._id,
    });

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// @desc  Get tickets endorsed by the current official
// @route GET /api/tickets/official
exports.getOfficialTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ officialId: req.user.id })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

// @desc  Official endorses / picks a ticket
// @route PATCH /api/tickets/:id/pick
exports.pickTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    if (ticket.officialId)
      return res
        .status(400)
        .json({ message: "Ticket already endorsed by an official." });

    ticket.officialId = req.user.id;
    await ticket.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "PICK_TICKET",
      resource: "Ticket",
      resourceId: ticket._id,
    });

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// @desc  Official assigns a contractor to a ticket
// @route PATCH /api/tickets/:id/assign-contractor
exports.assignContractor = async (req, res, next) => {
  try {
    const { contractorId } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: contractorId, status: "in_progress" },
      { new: true },
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    await AuditLog.create({
      userId: req.user.id,
      action: "ASSIGN_CONTRACTOR",
      resource: "Ticket",
      resourceId: ticket._id,
    });

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// @desc  Get ticket by ID
// @route GET /api/tickets/:id
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    const verification = await Verification.findOne({ ticketId: ticket._id });
    res.json({ ...ticket.toJSON(), verification });
  } catch (err) {
    next(err);
  }
};

// @desc  Update ticket status (authority only)
// @route PATCH /api/tickets/:id/status
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    if (status === "rejected" && !rejectionReason?.trim()) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "completed" ? { resolvedAt: new Date() } : {}),
        ...(status === "rejected"
          ? { rejectionReason: rejectionReason.trim() }
          : {}),
      },
      { new: true },
    );

    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    await AuditLog.create({
      userId: req.user.id,
      action: "UPDATE_STATUS",
      resource: "Ticket",
      resourceId: ticket._id,
      details: { status, rejectionReason },
    });

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// @desc  Upload work proof (government official / contractor role)
// @route POST /api/tickets/:id/proof
exports.uploadWorkProof = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Proof image is required." });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "ZeroCivicSense/proofs",
    );
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        proofImageUrl: result.secure_url,
        // Move to proof_submitted so citizens know there is proof to validate
        status: "proof_submitted",
        // Reset any previous proof votes when new proof is uploaded
        proofUpvotes: [],
        proofDownvotes: [],
        proofUpCount: 0,
        proofDownCount: 0,
      },
      { new: true },
    );

    // Trigger AI re-analysis with before/after comparison
    aiService.analyzeTicket(ticket._id, true).catch(console.error);

    await AuditLog.create({
      userId: req.user.id,
      action: "UPLOAD_PROOF",
      resource: "Ticket",
      resourceId: ticket._id,
    });

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete ticket
// @route DELETE /api/tickets/:id
exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    res.json({ message: "Ticket deleted." });
  } catch (err) {
    next(err);
  }
};

// @desc  Assign ticket to contractor (admin)
// @route PATCH /api/tickets/:id/assign
exports.assignTicket = async (req, res, next) => {
  try {
    const { contractorId } = req.body;
    const User = require("../models/User");
    const contractor = await User.findById(contractorId);
    if (!contractor || contractor.role !== "contractor") {
      return res.status(400).json({ message: "Invalid contractor." });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: contractorId, status: "in_progress" },
      { new: true },
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email department");

    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    await AuditLog.create({
      userId: req.user.id,
      action: "ASSIGN_TICKET",
      resource: "Ticket",
      resourceId: ticket._id,
      details: { contractorId },
    });

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// @desc  Vote / unvote on a ticket (citizens only — interest signal)
// @route PATCH /api/tickets/:id/vote
exports.voteTicket = async (req, res, next) => {
  try {
    if (req.user.role !== "citizen") {
      return res
        .status(403)
        .json({ message: "Only citizens can upvote tickets." });
    }
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    const userId = req.user.id;
    const alreadyVoted = ticket.votes.some((v) => v.toString() === userId);

    if (alreadyVoted) {
      ticket.votes = ticket.votes.filter((v) => v.toString() !== userId);
    } else {
      ticket.votes.push(userId);
    }
    ticket.voteCount = ticket.votes.length;
    await ticket.save();

    res.json({ voteCount: ticket.voteCount, voted: !alreadyVoted });
  } catch (err) {
    next(err);
  }
};

// @desc  Validate official's proof — citizens upvote (good) or downvote (fake/bad)
// @route PATCH /api/tickets/:id/proof-vote
exports.proofVoteTicket = async (req, res, next) => {
  try {
    if (req.user.role !== "citizen") {
      return res
        .status(403)
        .json({ message: "Only citizens can validate proof." });
    }
    const { direction } = req.body; // "up" or "down"
    if (!direction || !["up", "down"].includes(direction)) {
      return res
        .status(400)
        .json({ message: "direction must be 'up' or 'down'." });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    if (ticket.status !== "proof_submitted") {
      return res.status(400).json({ message: "No proof to validate yet." });
    }

    const userId = req.user.id;
    const upArr = ticket.proofUpvotes.map((v) => v.toString());
    const downArr = ticket.proofDownvotes.map((v) => v.toString());

    if (direction === "up") {
      if (upArr.includes(userId)) {
        // Toggle off
        ticket.proofUpvotes = ticket.proofUpvotes.filter(
          (v) => v.toString() !== userId,
        );
      } else {
        ticket.proofUpvotes.push(userId);
        // Remove from down if previously downvoted
        ticket.proofDownvotes = ticket.proofDownvotes.filter(
          (v) => v.toString() !== userId,
        );
      }
    } else {
      if (downArr.includes(userId)) {
        ticket.proofDownvotes = ticket.proofDownvotes.filter(
          (v) => v.toString() !== userId,
        );
      } else {
        ticket.proofDownvotes.push(userId);
        ticket.proofUpvotes = ticket.proofUpvotes.filter(
          (v) => v.toString() !== userId,
        );
      }
    }

    ticket.proofUpCount = ticket.proofUpvotes.length;
    ticket.proofDownCount = ticket.proofDownvotes.length;
    await ticket.save();

    res.json({
      proofUpCount: ticket.proofUpCount,
      proofDownCount: ticket.proofDownCount,
      userProofVote:
        upArr.includes(userId) && direction === "up"
          ? null
          : downArr.includes(userId) && direction === "down"
            ? null
            : direction,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get public ticket feed - all tickets visible to any logged-in user
// @route GET /api/tickets/public
exports.getPublicTickets = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name")
      .populate("assignedTo", "name isActive department")
      .sort({ voteCount: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Annotate whether the current user has voted / proof-voted
    const userId = req.user.id;
    const result = tickets.map((t) => ({
      ...t.toJSON(),
      userVoted: t.votes.some((v) => v.toString() === userId),
      userProofVote: t.proofUpvotes.some((v) => v.toString() === userId)
        ? "up"
        : t.proofDownvotes.some((v) => v.toString() === userId)
          ? "down"
          : null,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};
