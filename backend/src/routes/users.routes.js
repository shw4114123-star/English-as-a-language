import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { register, login, getMe } from "../controllers/users.ctrl.js";

const router = express.Router();

router.post("/register", asyncWrapper(register));
router.post("/login", asyncWrapper(login));
router.get("/me", authMiddleware, asyncWrapper(getMe));

export default router;
