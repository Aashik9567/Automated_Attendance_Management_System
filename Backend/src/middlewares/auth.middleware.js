import { User } from "../models/user.model.js";
import { apiError } from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Tokens travel only in the Authorization header (the app keeps no auth cookies).
export const authenticateUser = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new apiError(401, "Please sign in to continue");

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        // Signing out still works with an expired token.
        if (error.name === "TokenExpiredError" && req.path === "/logout") return next();
        throw new apiError(401, error.name === "TokenExpiredError" ? "Token has expired" : "Invalid token");
    }

    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) throw new apiError(401, "Invalid token");
    req.user = user;
    next();
});
