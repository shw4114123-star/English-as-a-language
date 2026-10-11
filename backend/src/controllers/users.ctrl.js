import {
    createUserDAL,
    getUserByEmailDAL
} from "../DAL/users.dal.js";
import { comparePassword, passwordHash } from "../utils/bcryptPassword.js";
import { createError } from "../utils/errorHandler.js";
import { genToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
    const { userName, email, password, fullName } = req.body;
    const role = "student";
    
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
    
    const existsUser = await getUserByEmailDAL(cleanEmail);
    if (!existsUser) {
        throw new createError("User not found", 404);
    }
    
    const pass = await comparePassword(password, existsUser.password);
    if (!pass) {
        throw new createError("Email / password not correct", 401);
    }
    
    const token = await genToken(existsUser._id.toString(), existsUser.role);
    
    delete existsUser.password;
    res.json({ success: true, data: { user: existsUser, token } });
};
