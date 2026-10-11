import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { register } from "../controllers/users.ctrl.js";

const router = express.Router();

router.post("/register", asyncWrapper(register));

export default router;
