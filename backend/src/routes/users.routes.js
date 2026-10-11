import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { register, login } from "../controllers/users.ctrl.js";

const router = express.Router();

router.post("/register", asyncWrapper(register));
router.post("/login", asyncWrapper(login));

export default router;
