import {
    createUserDAL,
    getUserByEmailDAL
} from "../DAL/users.dal.js";
import { passwordHash } from "../utils/bcryptPassword.js";
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
