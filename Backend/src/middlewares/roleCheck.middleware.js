// middlewares/roleCheck.middleware.js
import { apiError } from "../utils/errorHandler.js";

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new apiError(403, `You do not have permission to perform this action`);
        }
        next();
    };
};