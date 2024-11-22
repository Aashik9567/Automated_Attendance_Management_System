class apiError extends Error {
    constructor(statusCode,message="error occurred") {
        super(message);
        this.statusCode = statusCode
        this.message=message;
        this.error=error

    }
}
export {apiError}