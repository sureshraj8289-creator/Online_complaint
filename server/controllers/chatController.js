import Message from '../models/Message.js';
import Complaint from '../models/Complaint.js';

// @desc Get chat messages for a complaint ticket
// @route GET /api/chat/:complaintId
export const getMessages = async (req, res, next) => {
  try {
    const { complaintId } = req.params;

    const messages = await Message.find({ complaintId })
      .populate('senderId', 'name role avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc Send a message in a complaint ticket chat
// @route POST /api/chat/:complaintId
export const sendMessage = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { message, attachments } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const newMessage = await Message.create({
      complaintId,
      senderId: req.user._id,
      message,
      attachments: attachments || [],
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      'senderId',
      'name role avatar'
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};
