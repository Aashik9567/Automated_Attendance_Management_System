//assignment.model.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, "Subject is required"]
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Teacher reference is required"]
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"]
    },
    attachments: [{
        type: String // URLs to uploaded files
    }],
    submissions: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        submissionUrl: String,
        submittedAt: {
            type: Date,
            default: Date.now
        },
        grade: {
            type: Number,
            min: 0,
            max: 100
        },
        feedback: String
    }]
}, { timestamps: true });

export const Assignment = mongoose.model('Assignment', assignmentSchema);