import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import { Subject } from "../models/subject.model.js";
import { StudentSubject } from "../models/studentSubject.model.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const MIN_PASSWORD_LENGTH = 8;
const SAFE_FIELDS = "-password -refreshToken";
// Case-insensitive email match: older accounts may be stored with capitals.
const ANY_CASE = { locale: "en", strength: 2 };

// Rejects anything that isn't a plain string (e.g. {"$gt": ""} query objects).
const str = (value) => (typeof value === "string" ? value.trim() : "");

const checkPassword = (password) => {
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
        throw new apiError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
};

const checkSemester = (semester) => {
    const n = Number(semester);
    if (!Number.isInteger(n) || n < 1 || n > 8) throw new apiError(400, "Semester must be between 1 and 8");
    return n;
};

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

const createUser = async ({ fullName, email, password, semester, role }) => {
    if (!str(fullName) || !str(email)) throw new apiError(400, "Please provide all the details");
    checkPassword(password);
    const normalizedEmail = str(email).toLowerCase();
    if (await User.exists({ email: normalizedEmail }).collation(ANY_CASE)) {
        throw new apiError(409, "An account with this email already exists");
    }
    const user = await User.create({
        fullName: str(fullName),
        email: normalizedEmail,
        password,
        role,
        semester: role === "Admin" ? undefined : checkSemester(semester),
    });
    return User.findById(user._id).select(SAFE_FIELDS);
};

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = str(req.body.refreshToken);
    if (!incomingRefreshToken) throw new apiError(401, "Unauthorized request");

    let decoded;
    try {
        decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        throw new apiError(401, "Invalid refresh token");
    }
    const user = await User.findById(decoded._id);
    // Refresh tokens are single-use: a stale one means it was already rotated.
    if (!user || incomingRefreshToken !== user.refreshToken) {
        throw new apiError(401, "Refresh token is expired or used");
    }

    const tokens = await generateAccessAndRefreshToken(user._id);
    return res.status(200).json(new apiResponse(200, "Access token refreshed", tokens));
});

// Public sign-up creates student accounts only; teachers are added by an admin.
const signupUser = asyncHandler(async (req, res) => {
    if (req.body.role && req.body.role !== "Student") {
        throw new apiError(403, "Teacher accounts are created by an admin");
    }
    const createdUser = await createUser({ ...req.body, role: "Student" });

    // Students who join after a subject was created still need enrolling.
    const subjects = await Subject.find({ semester: createdUser.semester }).select("_id");
    if (subjects.length) {
        await StudentSubject.insertMany(
            subjects.map((s) => ({ student: createdUser._id, subject: s._id, semester: createdUser.semester }))
        );
    }

    return res.status(201).json(new apiResponse(201, "Account created successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
    const email = str(req.body.email).toLowerCase();
    const { password } = req.body;
    if (!email || typeof password !== "string" || !password) {
        throw new apiError(400, "Please provide your email and password");
    }
    const user = await User.findOne({ email }).collation(ANY_CASE);
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new apiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loginUser = await User.findById(user._id).select(SAFE_FIELDS);
    return res
        .status(200)
        .json(new apiResponse(200, "Signed in successfully", { loginUser, accessToken, refreshToken }));
});

const logoutUser = asyncHandler(async (req, res) => {
    if (req.user) await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res.json(new apiResponse(200, "Signed out successfully", null));
});

const getAllStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: "Student" }).select("fullName email semester avatar");
    res.status(200).json({ success: true, count: students.length, data: students });
});

const updateProfile = asyncHandler(async (req, res) => {
    const updateFields = {};
    if (str(req.body.fullName)) updateFields.fullName = str(req.body.fullName);
    if (req.body.semester && req.user.role !== "Admin") updateFields.semester = checkSemester(req.body.semester);
    if (Object.keys(updateFields).length === 0) {
        throw new apiError(400, "Please provide at least one field to update");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).select(SAFE_FIELDS);
    if (!updatedUser) throw new apiError(404, "User not found");

    return res.status(200).json(new apiResponse(200, "Profile updated successfully", updatedUser));
});

// Admin: every account, newest first.
const listUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select(SAFE_FIELDS).sort({ createdAt: -1 });
    res.status(200).json(new apiResponse(200, "Users fetched successfully", users));
});

// Admin: create a teacher account.
const createTeacher = asyncHandler(async (req, res) => {
    const teacher = await createUser({ ...req.body, role: "Teacher" });
    res.status(201).json(new apiResponse(201, "Teacher account created", teacher));
});

// Creates the admin account ("admin") from ADMIN_EMAIL / ADMIN_PASSWORD the
// first time the server starts with them set. The password is never in code.
const ensureAdminAccount = async () => {
    const email = str(process.env.ADMIN_EMAIL).toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (await User.exists({ role: "Admin" })) return;
    if (!email || !password) {
        console.warn("No admin account yet: set ADMIN_EMAIL and ADMIN_PASSWORD to create one.");
        return;
    }
    await createUser({ fullName: "admin", email, password, role: "Admin" });
    console.log(`Admin account created for ${email}`);
};

export {
    signupUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateProfile,
    getAllStudents,
    listUsers,
    createTeacher,
    ensureAdminAccount,
};
