import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    subjects: {
      type: [String],
      default: []
    },
    subjectScores: {
      type: Map,
      of: Number,
      default: {}
    },
    attendance: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    grade: {
      type: String,
      required: true,
      trim: true
    },
    previousGrades: {
      type: [String],
      default: []
    },
    projects: {
      type: [String],
      default: []
    },
    achievements: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model('Student', StudentSchema);
