import jwt from "jsonwebtoken";

export const genToken = async (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'supersecret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}
export const verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
}