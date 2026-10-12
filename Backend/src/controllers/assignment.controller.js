import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { Assignment } from "../models/assignment.model.js";
import apiResponse from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.middleware.js";
import { findOwnedSubject } from "../utils/findOwnedSubject.js";

const uploadAll = async (files = [], folder) =>
    (await Promise.all(files.map((file) => uploadToCloudinary(file.buffer, folder)))).map((r) => r.secure_url);

// Students see only their own submission, never classmates' files or grades.
const forViewer = (assignment, user) => {
    if (user.role !== "Student") return assignment;
    const plain = assignment.toObject();
    plain.submissions = plain.submissions.filter((s) => String(s.student?._id ?? s.student) === String(user._id));
    return plain;
};

// User text used as a search pattern must not act as a regex.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const assertOwner = (assignment, user, action) => {
    if (!assignment.teacher.equals(user._id)) throw new apiError(403, `Unauthorized to ${action} this assignment`);
};

const createAssignment = asyncHandler(async (req, res) => {
    const { title, description, subject, dueDate } = req.body;
    await findOwnedSubject(subject, req.user);
    const assignment = await Assignment.create({
        title,
        description,
        subject,
        dueDate,
        attachments: await uploadAll(req.files),
        teacher: req.user._id,
    });
    res.status(201).json(assignment);
});

const submitAssignment = asyncHandler(async (req, res) => {
    const file = req.files?.[0];
    if (!file) throw new apiError(400, "Please attach a file to submit");
    if (!(await Assignment.exists({ _id: req.params.id }))) throw new apiError(404, "Assignment not found");

    const [submissionUrl] = await uploadAll([file], "submissions");
    const assignment = await Assignment.findByIdAndUpdate(
        req.params.id,
        { $push: { submissions: { student: req.user._id, submissionUrl, submittedAt: new Date() } } },
        { new: true }
    );
    res.status(200).json({ success: true, data: forViewer(assignment, req.user) });
});

// Teachers see their own assignments; students see all of them.
const getAssignments = asyncHandler(async (req, res) => {
    const { subject, search } = req.query;
    const query = {};
    if (typeof subject === "string" && subject) query.subject = subject;
    if (typeof search === "string" && search) query.title = { $regex: escapeRegex(search), $options: "i" };
    if (req.user.role === "Teacher") query.teacher = req.user._id;

    const assignments = await Assignment.find(query)
        .populate("subject", "name code")
        .populate("teacher", "fullName")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, "Assignments fetched successfully", assignments.map((a) => forViewer(a, req.user)))
    );
});

const getAssignmentById = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id)
        .populate("subject", "name code")
        .populate("teacher", "fullName")
        .populate("submissions.student", "fullName");
    if (!assignment) throw new apiError(404, "Assignment not found");

    return res.status(200).json(new apiResponse(200, "Assignment fetched successfully", forViewer(assignment, req.user)));
});

const updateAssignment = asyncHandler(async (req, res) => {
    const { title, description, subject, dueDate } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) throw new apiError(404, "Assignment not found");
    assertOwner(assignment, req.user, "update");
    if (subject) await findOwnedSubject(subject, req.user);

    const updatedAssignment = await Assignment.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title: title || assignment.title,
                description: description || assignment.description,
                subject: subject || assignment.subject,
                dueDate: dueDate || assignment.dueDate,
                attachments: [...assignment.attachments, ...(await uploadAll(req.files))],
            },
        },
        { new: true, runValidators: true }
    ).populate("subject", "name code");

    return res.status(200).json(new apiResponse(200, "Assignment updated successfully", updatedAssignment));
});

const deleteAssignment = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) throw new apiError(404, "Assignment not found");
    assertOwner(assignment, req.user, "delete");
    await assignment.deleteOne();
    return res.status(200).json(new apiResponse(200, "Assignment deleted successfully", null));
});

const gradeSubmission = asyncHandler(async (req, res) => {
    const { id, submissionId } = req.params;
    const { grade, feedback } = req.body;
    const score = Number(grade);
    if (grade === undefined || grade === null || grade === "" || Number.isNaN(score) || score < 0 || score > 100) {
        throw new apiError(400, "Valid grade is required");
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) throw new apiError(404, "Assignment not found");
    assertOwner(assignment, req.user, "grade");

    const submission = assignment.submissions.id(submissionId);
    if (!submission) throw new apiError(404, "Submission not found");
    submission.grade = score;
    submission.feedback = typeof feedback === "string" ? feedback : undefined;
    await assignment.save();

    return res.status(200).json(new apiResponse(200, "Submission graded successfully", assignment));
});

export {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    gradeSubmission,
};
