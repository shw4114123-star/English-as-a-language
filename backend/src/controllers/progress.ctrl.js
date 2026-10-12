import {
    initProgressDAL,
    getProgressByUserIdDAL,
    updateProgressByUserIdDAL
} from "../DAL/progress.dal.js";
import { createError } from "../utils/errorHandler.js";

export const getMyProgress = async (req, res) => {
    const userId = req.user.userId;
    let progress = await getProgressByUserIdDAL(userId);
    
    if (!progress) {
        // Auto-initialize if it doesn't exist
        progress = await initProgressDAL(userId);
    }
    
    res.json({ success: true, data: progress });
};

export const updateMyProgress = async (req, res) => {
    const userId = req.user.userId;
    const { xpToAdd, lessonCompleted, gameScore, placementTestScore } = req.body;
    
    const currentProgress = await getProgressByUserIdDAL(userId) || await initProgressDAL(userId);
    
    const updateQuery = { $set: {}, $push: {}, $addToSet: {}, $inc: {} };
    
    if (xpToAdd && !isNaN(xpToAdd)) {
        updateQuery.$inc.xp = Number(xpToAdd);
    }
    if (placementTestScore !== undefined && !isNaN(placementTestScore)) {
        const score = Number(placementTestScore);
        updateQuery.$set.placementTestScore = score;
        // Logic to set level based on score
        if (score > 80) updateQuery.$set.level = "Advanced";
        else if (score > 50) updateQuery.$set.level = "Intermediate";
        else updateQuery.$set.level = "Beginner";
    }
    if (lessonCompleted) {
        updateQuery.$addToSet.completedLessons = String(lessonCompleted);
    }
    if (gameScore) {
        const scoreObj = typeof gameScore === 'object' 
            ? { ...gameScore, date: new Date() } 
            : { score: gameScore, date: new Date() };
        updateQuery.$push.gameScores = scoreObj;
    }
    
    // Cleanup empty operators
    if (Object.keys(updateQuery.$set).length === 0) delete updateQuery.$set;
    if (Object.keys(updateQuery.$push).length === 0) delete updateQuery.$push;
    if (Object.keys(updateQuery.$addToSet).length === 0) delete updateQuery.$addToSet;
    if (Object.keys(updateQuery.$inc).length === 0) delete updateQuery.$inc;

    const updatedProgress = await updateProgressByUserIdDAL(userId, updateQuery);
    
    res.json({ success: true, data: updatedProgress });
};
