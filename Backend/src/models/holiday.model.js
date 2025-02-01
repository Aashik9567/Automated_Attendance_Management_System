import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Holiday title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Validate end date is after start date
holidaySchema.pre('validate', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

export const Holiday = mongoose.model('Holiday', holidaySchema);