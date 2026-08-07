import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { sendNotificationEmail } from '../utils/mailer.js';

// Helper to generate unique ticket ID
const generateTicketId = () => {
  const prefix = 'TKT';
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomDigits}`;
};

// @desc Create new complaint
// @route POST /api/complaints
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, attachments } = req.body;

    const ticketId = generateTicketId();

    const complaint = await Complaint.create({
      ticketId,
      title,
      description,
      category,
      priority: priority || 'Medium',
      userId: req.user._id,
      attachments: attachments || [],
      history: [
        {
          updatedBy: req.user._id,
          action: 'Ticket Created',
          note: `Complaint submitted under ${category}`,
        },
      ],
    });

    const populated = await Complaint.findById(complaint._id).populate('userId', 'name email');

    // Notify user
    sendNotificationEmail({
      to: req.user.email,
      subject: `[${ticketId}] Complaint Received: ${title}`,
      html: `<p>Hello ${req.user.name},</p><p>Your complaint <strong>${ticketId}</strong> has been logged. We will update you as soon as an agent is assigned.</p>`,
    });

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc Get complaints (filtered by role)
// @route GET /api/complaints
export const getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, search } = req.query;
    let query = {};

    // Role-specific visibility rules
    if (req.user.role === 'USER') {
      query.userId = req.user._id;
    } else if (req.user.role === 'AGENT') {
      query.$or = [{ agentId: req.user._id }, { status: 'Pending' }];
    }
    // Admin gets all complaints

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email avatar department')
      .populate('agentId', 'name email avatar department')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc Get single complaint by ID or Ticket ID
// @route GET /api/complaints/:id
export const getComplaintById = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone avatar department')
      .populate('agentId', 'name email phone avatar department')
      .populate('history.updatedBy', 'name role');

    if (!complaint) {
      complaint = await Complaint.findOne({ ticketId: req.params.id })
        .populate('userId', 'name email phone avatar department')
        .populate('agentId', 'name email phone avatar department')
        .populate('history.updatedBy', 'name role');
    }

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint ticket not found' });
    }

    // Access authorization check
    if (
      req.user.role === 'USER' &&
      complaint.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden: You do not own this ticket' });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc Update complaint status & resolution
// @route PATCH /api/complaints/:id/status
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes, note } = req.body;

    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Verify permission: Agents can update assigned complaints, Admin can update any
    if (
      req.user.role === 'AGENT' &&
      complaint.agentId &&
      complaint.agentId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }

    const oldStatus = complaint.status;
    if (status) complaint.status = status;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;

    complaint.history.push({
      updatedBy: req.user._id,
      action: `Status changed from ${oldStatus} to ${status || oldStatus}`,
      note: note || resolutionNotes || `Updated by ${req.user.name}`,
    });

    await complaint.save();

    // Send email notification on status change
    if (complaint.userId && complaint.userId.email) {
      sendNotificationEmail({
        to: complaint.userId.email,
        subject: `[${complaint.ticketId}] Status Update: ${complaint.status}`,
        html: `<p>Hello ${complaint.userId.name},</p><p>Your ticket <strong>${complaint.ticketId}</strong> status has changed to <strong>${complaint.status}</strong>.</p><p>${resolutionNotes ? 'Resolution Notes: ' + resolutionNotes : ''}</p>`,
      });
    }

    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone avatar department')
      .populate('agentId', 'name email phone avatar department')
      .populate('history.updatedBy', 'name role');

    res.json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};

// @desc Delete complaint (Admin only)
// @route DELETE /api/complaints/:id
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint removed successfully' });
  } catch (error) {
    next(error);
  }
};
