import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ complaintId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
