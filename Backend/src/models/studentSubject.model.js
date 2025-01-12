import mongoose from 'mongoose';

const studentSubjectSchema = new mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    totalClasses: {
      type: Number,
      default: 0
    },
    attendedClasses: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });
export const StudentSubject = mongoose.model('StudentSubject', studentSubjectSchema);