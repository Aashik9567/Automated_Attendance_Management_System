import { User } from "../models/user.model.js";
import { apiError } from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authenticateUser = asyncHandler(async (req, res, next) => {
    try {
        // Token extraction logic is good
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new apiError(401, "Please authenticate to access this route");
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Find user and exclude sensitive information
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
 
        if (!user) {
            throw new apiError(401, "Invalid token");
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        // More specific error handling would be beneficial
        if (error.name === 'JsonWebTokenError') {
            throw new apiError(401, "Invalid token");
        } else if (error.name === 'TokenExpiredError') {
            throw new apiError(401, "Token has expired");
        } else {
            // Generic error for other authentication issues
            throw new apiError(401, error.message || "Authentication failed");
        }
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