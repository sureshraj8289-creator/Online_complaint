import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';

// @desc Get system analytics metrics
// @route GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingCount = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressCount = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedCount = await Complaint.countDocuments({ status: 'Resolved' });
    const closedCount = await Complaint.countDocuments({ status: 'Closed' });
    const rejectedCount = await Complaint.countDocuments({ status: 'Rejected' });

    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalAgents = await User.countDocuments({ role: 'AGENT' });

    // Category breakdown
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    // Priority breakdown
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $project: { priority: '$_id', count: 1, _id: 0 } },
    ]);

    // Average feedback rating
    const feedbackAggregation = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalFeedbacks: { $sum: 1 } } },
    ]);

    const avgRating = feedbackAggregation.length > 0 ? Number(feedbackAggregation[0].avgRating.toFixed(1)) : 5.0;
    const totalFeedbacks = feedbackAggregation.length > 0 ? feedbackAggregation[0].totalFeedbacks : 0;

    res.json({
      totalComplaints,
      pendingCount,
      inProgressCount,
      resolvedCount,
      closedCount,
      rejectedCount,
      totalUsers,
      totalAgents,
      categoryStats,
      priorityStats,
      avgRating,
      totalFeedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all system users
// @route GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc Update user role
// @route PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role, department } = req.body;
    if (!['USER', 'AGENT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    if (department) user.department = department;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};
