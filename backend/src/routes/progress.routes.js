import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getMyProgress, updateMyProgress } from "../controllers/progress.ctrl.js";

const router = express.Router();

// All progress routes are protected
router.use(authMiddleware);

router.get("/me", asyncWrapper(getMyProgress));
router.patch("/me", asyncWrapper(updateMyProgress));

export default router;
