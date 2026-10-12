import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    createTeacher,
    getAllStudents,
    listUsers,
    loginUser,
    logoutUser,
    refreshAccessToken,
    signupUser,
    updateProfile,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/roleCheck.middleware.js";

// Slows down password guessing: 10 attempts per minute per address.
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts. Please wait a minute and try again." },
});

const router = Router();
router.post("/signup", authLimiter, signupUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", authenticateUser, logoutUser);
router.post("/refreshtoken", refreshAccessToken);
router.patch("/update-profile", authenticateUser, updateProfile);
router.get("/students", authenticateUser, restrictTo("Teacher", "Admin"), getAllStudents);

// Admin only
router.get("/", authenticateUser, restrictTo("Admin"), listUsers);
router.post("/teachers", authenticateUser, restrictTo("Admin"), createTeacher);

export default router;
