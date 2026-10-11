import { createError } from "../utils/errorHandler.js";

export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new createError("Unauthorized", 401));
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return next(new createError("Forbidden: You do not have the required role", 403));
        }
        
        next();
    };
};
