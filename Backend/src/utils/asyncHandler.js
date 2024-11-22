const asyncHandler = (asyncFn) => async(req, res, next) => {
    try {
       return await asyncFn(req, res, next);
    } catch (error) {
        res.status(error.statusCode).json(
            {
            message: error.message,
            success: false
        });
    }
}
export default asyncHandler;