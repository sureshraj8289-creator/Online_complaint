import Feedback from '../models/Feedback.js';
import Complaint from '../models/Complaint.js';

// @desc Submit feedback for a resolved complaint
// @route POST /api/feedback
export const submitFeedback = async (req, res, next) => {
  try {
    const { complaintId, rating, comment, resolutionSatisfaction, responseTimeRating } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only ticket creator can submit feedback' });
    }

    const existingFeedback = await Feedback.findOne({ complaintId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback has already been submitted for this ticket' });
    }

    const feedback = await Feedback.create({
      complaintId,
      userId: req.user._id,
      rating,
      comment: comment || '',
      resolutionSatisfaction: resolutionSatisfaction || 'Completely Satisfied',
      responseTimeRating: responseTimeRating || 5,
    });

    // Optionally mark complaint status as Closed
    complaint.status = 'Closed';
    complaint.history.push({
      updatedBy: req.user._id,
      action: 'Feedback Submitted & Ticket Closed',
      note: `User rated ${rating}/5 stars: "${comment || 'No comment'}"`,
    });
    await complaint.save();

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc Get all feedback reviews (Admin & Agents)
// @route GET /api/feedback
export const getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'name email avatar')
      .populate('complaintId', 'ticketId title category status agentId')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};
