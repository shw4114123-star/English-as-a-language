import {
    createUserDAL,
    deleteUserByIdDAL,
    getAllUsersDAL,
    getUserByEmailDAL,
    getUserByIdDAL,
    updateUserByIdDAL
} from "../DAL/users.dal.js";
import { comparePassword, passwordHash } from "../utils/bcryptPassword.js";
import { createError } from "../utils/errorHandler.js";
import { genToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
    const { userName, email, password, fullName } = req.body;
    const role = "student"; // Default role
    
    const existsUser = await getUserByEmailDAL(email);
    if (existsUser) throw new createError("User with this email already exists", 400);
    
    const passHash = await passwordHash(password);
    const user = await createUserDAL(userName, email, passHash, fullName, role);
    
    delete user.password;
    const token = await genToken(user._id.toString(), user.role);
    
    res.status(201).json({ success: true, data: { user, token } });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    
    console.log(`[Login Attempt] cleanEmail: "${cleanEmail}", password provided length: ${password?.length}`);
    const existsUser = await getUserByEmailDAL(cleanEmail);
    if (!existsUser) {
        console.log(`[Login Failed] User not found with email: "${cleanEmail}"`);
        throw new createError("User not found", 404);
    }
    
    console.log(`[Login User Found] User id: ${existsUser._id}, stored password hash: ${existsUser.password?.substring(0, 15)}...`);
    const pass = await comparePassword(password, existsUser.password);
    console.log(`[Login Password Match Result]: ${pass}`);
    if (!pass) {
        console.log(`[Login Failed] Incorrect password for email: "${cleanEmail}"`);
        throw new createError("Email / password not correct", 401);
    }
    
    const token = await genToken(existsUser._id.toString(), existsUser.role);
    console.log(`[Login Success] User ${cleanEmail} logged in successfully! Role: ${existsUser.role}`);
    
    delete existsUser.password;
    res.json({ success: true, data: { user: existsUser, token } });
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await getUserByIdDAL(id);
    if (!user) throw new createError("User not found", 404);
    
    delete user.password;
    res.json({ success: true, data: user });
};

export const getMe = async (req, res) => {
    const userId = req.user.userId;
    const user = await getUserByIdDAL(userId);
    if (!user) throw new createError("User not found", 404);
    
    delete user.password;
    res.json({ success: true, data: user });
};

export const getAllUsers = async (req, res) => {
    const users = await getAllUsersDAL();
    res.json({ success: true, data: users });
};

export const deleteUser = async (req, res) => {
    const reqUserId = req.user.userId;
    const reqUserRole = req.user.role;
    const targetUserId = req.params.id;

    const targetUser = await getUserByIdDAL(targetUserId);
    if (!targetUser) throw new createError("User not found", 404);

    if (reqUserRole !== "admin" && reqUserId !== targetUserId) {
         throw new createError("You do not have sufficient permissions to delete this user", 403);
    }

    if (targetUser.role === "admin" && reqUserRole !== "admin") {
         throw new createError("You cannot delete an admin user", 403);
    }

    const deleted = await deleteUserByIdDAL(targetUserId);
    res.json({ success: true, data: deleted });
};

export const updateUser = async (req, res) => {
    const targetUserId = req.params.id;
    const updates = req.body;
    
    if (updates.password) {
         updates.password = await passwordHash(updates.password);
    }
    
    // Prevent role changing unless admin
    if (updates.role && req.user.role !== "admin") {
        delete updates.role;
    }

    const updatedUser = await updateUserByIdDAL(targetUserId, updates);
    res.json({ success: true, data: updatedUser });
};
