import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import { sendNotificationEmail } from '../utils/mailer.js';

// @desc Get all registered agents & workload
// @route GET /api/agents
export const getAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'AGENT' }).select('-password');
    
    // Enrich with active ticket counts
    const enrichedAgents = await Promise.all(
      agents.map(async (agent) => {
        const activeCount = await Complaint.countDocuments({
          agentId: agent._id,
          status: { $in: ['Pending', 'In Progress'] },
        });
        const resolvedCount = await Complaint.countDocuments({
          agentId: agent._id,
          status: { $in: ['Resolved', 'Closed'] },
        });
        return {
          ...agent.toObject(),
          activeTickets: activeCount,
          resolvedTickets: resolvedCount,
        };
      })
    );

    res.json(enrichedAgents);
  } catch (error) {
    next(error);
  }
};

// @desc Assign agent to a complaint (Admin only)
// @route PATCH /api/agents/assign
export const assignAgent = async (req, res, next) => {
  try {
    const { complaintId, agentId } = req.body;

    const complaint = await Complaint.findById(complaintId).populate('userId', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'AGENT') {
      return res.status(400).json({ message: 'Target user is not a valid Agent' });
    }

    complaint.agentId = agent._id;
    if (complaint.status === 'Pending') {
      complaint.status = 'In Progress';
    }

    complaint.history.push({
      updatedBy: req.user._id,
      action: `Assigned to Agent: ${agent.name}`,
      note: `Ticket handed over to ${agent.department} department`,
    });

    await complaint.save();

    // Increment agent counter
    await User.findByIdAndUpdate(agent._id, { $inc: { assignedComplaintsCount: 1 } });

    // Notify Agent & User
    sendNotificationEmail({
      to: agent.email,
      subject: `[New Ticket Assigned] ${complaint.ticketId}: ${complaint.title}`,
      html: `<p>Hello ${agent.name},</p><p>You have been assigned to handle complaint ticket <strong>${complaint.ticketId}</strong>.</p>`,
    });

    const updatedComplaint = await Complaint.findById(complaintId)
      .populate('userId', 'name email avatar department')
      .populate('agentId', 'name email avatar department')
      .populate('history.updatedBy', 'name role');

    res.json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};
