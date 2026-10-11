import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    register,
    login,
    getUserById,
    getMe,
    getAllUsers,
    deleteUser,
    updateUser
} from "../controllers/users.ctrl.js";

const router = express.Router();

// Auth routes
router.post("/register", asyncWrapper(register));
router.post("/login", asyncWrapper(login));
router.get("/me", authMiddleware, asyncWrapper(getMe));

// Users CRUD
router.get("/", authMiddleware, asyncWrapper(getAllUsers));
router.get("/:id", authMiddleware, asyncWrapper(getUserById));
router.patch("/:id", authMiddleware, asyncWrapper(updateUser));
router.delete("/:id", authMiddleware, asyncWrapper(deleteUser));

export default router;
