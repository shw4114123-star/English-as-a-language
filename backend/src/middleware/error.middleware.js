export const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    
    console.error(`[Error] ${status} - ${message}`);
    
    // Sanitize internal server, database, or connection details in client response
    const clientError = (status === 500 || /mongo|database|econnrefused|failed to fetch/i.test(message))
        ? "An internal server error occurred. Please try again later."
        : message;

    res.status(status).json({
        success: false,
        error: clientError
    });
};
