import { createError } from "../utils/errorHandler.js";
import { verifyToken } from "../utils/generateToken.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw new createError("Missing authorization header", 401);

        // Handle "Bearer <token>" or just "<token>"
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        if (!token) throw new createError("Missing token", 401);

        const user = await verifyToken(token);
        req.user = user; // Set req.user to the decoded token { userId, role }
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            next(new createError("Invalid or expired token", 401));
        } else {
            next(err);
        }
    }
};
