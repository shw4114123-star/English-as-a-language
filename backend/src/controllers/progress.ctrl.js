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
    
    const updateQuery = { $set: {}, $push: {}, $inc: {} };
    
    if (xpToAdd) updateQuery.$inc.xp = xpToAdd;
    if (placementTestScore !== undefined) {
        updateQuery.$set.placementTestScore = placementTestScore;
        // Simple logic to set level based on score
        if (placementTestScore > 80) updateQuery.$set.level = "Advanced";
        else if (placementTestScore > 50) updateQuery.$set.level = "Intermediate";
        else updateQuery.$set.level = "Beginner";
    }
    if (lessonCompleted) updateQuery.$push.completedLessons = lessonCompleted;
    if (gameScore) updateQuery.$push.gameScores = gameScore;
    
    // Cleanup empty operators
    if (Object.keys(updateQuery.$set).length === 0) delete updateQuery.$set;
    if (Object.keys(updateQuery.$push).length === 0) delete updateQuery.$push;
    if (Object.keys(updateQuery.$inc).length === 0) delete updateQuery.$inc;

    const updatedProgress = await updateProgressByUserIdDAL(userId, updateQuery);
    
    res.json({ success: true, data: updatedProgress });
};
