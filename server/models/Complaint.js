import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Billing & Payment', 'Technical Issue', 'Account Access', 'Product / Service Quality', 'Security & Fraud', 'Other'],
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
    resolutionNotes: {
      type: String,
      default: '',
    },
    history: [historySchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for combined queries & fast filtering
complaintSchema.index({ status: 1, userId: 1 });
complaintSchema.index({ status: 1, agentId: 1 });
complaintSchema.index({ createdAt: -1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
