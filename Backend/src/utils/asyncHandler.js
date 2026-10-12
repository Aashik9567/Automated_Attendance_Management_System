import { apiError } from "./errorHandler.js";

// Turns database errors that come from bad input into 4xx responses.
const statusFor = (error) => {
    if (error instanceof apiError) return error.statusCode;
    if (error.name === "ValidationError" || error.name === "CastError") return 400;
    if (error.code === 11000) return 409; // unique index, e.g. a duplicate subject code
    return 500;
};

// Every controller answers errors in one shape: { success: false, message }.
// Unexpected failures get a generic message so internals never reach users.
const asyncHandler = (asyncFn) => async (req, res, next) => {
    try {
        return await asyncFn(req, res, next);
    } catch (error) {
        const statusCode = statusFor(error);
        const expected = statusCode < 500 || error instanceof apiError;
        if (!expected) console.error(error);
        else if (statusCode >= 500) console.warn(`[${req.method} ${req.originalUrl}] ${statusCode}: ${error.message}`);

        let message = expected ? error.message : "Something went wrong. Please try again.";
        if (error.name === "ValidationError") message = Object.values(error.errors)[0]?.message || message;
        if (error.name === "CastError") message = `Invalid ${error.path}`;
        if (error.code === 11000) message = "That already exists";
        return res.status(statusCode).json({ success: false, message });
    }
};

export default asyncHandler;
