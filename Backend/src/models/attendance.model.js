import mongoose from "mongoose";
// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    students: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imageUrl: {
      type: String // URL or path to the attendance image
    }
  }, { timestamps: true });
  export const Attendance = mongoose.model('Attendance', attendanceSchema);