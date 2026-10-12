import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    createAccount,
    getUserActivity,
    resetPassword,
    deleteUser,
    getAllStudents,
    listUsers,
    loginUser,
    logoutUser,
    refreshAccessToken,
    signupUser,
    updateProfile,
    changePassword,
    updateAvatar,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/roleCheck.middleware.js";
import { imageUpload } from "../middlewares/fileUpload.middleware.js";

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
router.patch("/change-password", authLimiter, authenticateUser, changePassword);
router.post("/avatar", authenticateUser, imageUpload.single("avatar"), updateAvatar);
router.get("/students", authenticateUser, restrictTo("Teacher", "Admin"), getAllStudents);

// Admin only
router.get("/", authenticateUser, restrictTo("Admin"), listUsers);
router.post("/", authenticateUser, restrictTo("Admin"), createAccount);
router.get("/:id/activity", authenticateUser, restrictTo("Admin"), getUserActivity);
router.patch("/:id/password", authenticateUser, restrictTo("Admin"), resetPassword);
router.delete("/:id", authenticateUser, restrictTo("Admin"), deleteUser);

export default router;
