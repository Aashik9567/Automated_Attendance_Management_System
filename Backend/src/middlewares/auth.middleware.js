import { User } from "../models/user.model.js";
import { apiError } from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authenticateUser = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new apiError(401, "Please authenticate to access this route");
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded?._id).select("-password -refreshToken");

            if (!user) {
                throw new apiError(401, "Invalid token");
            }

            req.user = user;
            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Allow logout even if the token is expired
                if (req.path === "/logout") {
                    return next();
                }
                throw new apiError(401, "Token has expired");
            }
            throw new apiError(401, "Invalid token");
        }
    } catch (error) {
        throw new apiError(401, error.message || "Authentication failed");
    }
});

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new apiError(401, "Authentication required");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new apiError(403, "Access denied: Insufficient permissions");
        }

        next();
    };
};