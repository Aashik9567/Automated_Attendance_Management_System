const asyncHandler = (asyncFn) => async (req, res, next) => {
    try {
        return await asyncFn(req, res, next);
    } catch (error) {
        // Log the error for server-side debugging
        console.error(error);

        // Check if it's an instance of apiError or a standard error
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";

        return res.status(statusCode).json({
            success: false,
            message: message 
        });
    }
};

export default asyncHandler;