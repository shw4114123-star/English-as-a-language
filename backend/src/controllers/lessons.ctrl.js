import {
    createLessonDAL,
    getAllLessonsDAL,
    getLessonByIdDAL,
    updateLessonByIdDAL,
    deleteLessonByIdDAL
} from "../DAL/lessons.dal.js";
import { createError } from "../utils/errorHandler.js";

export const createLesson = async (req, res) => {
    // Only teachers/admins can create (enforced by roleMiddleware in router)
    const { title, description, level, words, questions } = req.body;
    
    if (!title || !level) throw new createError("Title and level are required", 400);

    const lesson = await createLessonDAL({ title, description, level, words, questions });
    res.status(201).json({ success: true, data: lesson });
};

export const getAllLessons = async (req, res) => {
    const lessons = await getAllLessonsDAL();
    res.json({ success: true, data: lessons });
};

export const getLessonById = async (req, res) => {
    const { id } = req.params;
    const lesson = await getLessonByIdDAL(id);
    if (!lesson) throw new createError("Lesson not found", 404);
    
    res.json({ success: true, data: lesson });
};

export const updateLesson = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedLesson = await updateLessonByIdDAL(id, updates);
    if (!updatedLesson) throw new createError("Lesson not found", 404);
    
    res.json({ success: true, data: updatedLesson });
};

export const deleteLesson = async (req, res) => {
    const { id } = req.params;
    
    const deletedLesson = await deleteLessonByIdDAL(id);
    if (!deletedLesson) throw new createError("Lesson not found", 404);
    
    res.json({ success: true, data: deletedLesson });
};
