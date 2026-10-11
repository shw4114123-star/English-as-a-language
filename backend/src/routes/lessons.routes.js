import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import {
    createLesson,
    getAllLessons,
    getLessonById,
    updateLesson,
    deleteLesson
} from "../controllers/lessons.ctrl.js";

const router = express.Router();

// Public or student routes
router.get("/", authMiddleware, asyncWrapper(getAllLessons));
router.get("/:id", authMiddleware, asyncWrapper(getLessonById));

// Protected teacher & admin routes
router.post("/", authMiddleware, roleMiddleware(["teacher", "admin"]), asyncWrapper(createLesson));
router.patch("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), asyncWrapper(updateLesson));
router.delete("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), asyncWrapper(deleteLesson));

export default router;
