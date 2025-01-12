import mongoose from 'mongoose';
// Define the subject schema
const subjectSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    semester: {
      type: Number,
      required: true
    },
    creditHours: {
      type: Number,
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });
  
export const Subject = mongoose.model('Subject', subjectSchema); 