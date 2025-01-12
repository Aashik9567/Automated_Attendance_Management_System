import mongoose from 'mongoose';
const holidaySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    description: String
  }, { timestamps: true });
  
export const Holiday = mongoose.model('Holiday', holidaySchema);