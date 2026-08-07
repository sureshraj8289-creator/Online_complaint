import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
    },
    resolutionSatisfaction: {
      type: String,
      enum: ['Completely Satisfied', 'Somewhat Satisfied', 'Neutral', 'Dissatisfied'],
      default: 'Completely Satisfied',
    },
    responseTimeRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
