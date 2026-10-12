import { ObjectId } from "mongodb";
import { db } from "../db/mongodb.js";

export async function initProgressDAL(userId) {
    const progress = db.collection("progress");
    const newProgress = {
        userId: new ObjectId(userId),
        completedLessons: [],
        gameScores: [],
        xp: 0,
        level: "Beginner",
        placementTestScore: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    await progress.insertOne(newProgress);
    return newProgress;
}

export async function getProgressByUserIdDAL(userId) {
    const progress = db.collection("progress");
    return await progress.findOne({ userId: new ObjectId(userId) });
}

export async function updateProgressByUserIdDAL(userId, updateData) {
    const progress = db.collection("progress");
    if (!updateData.$set) {
        updateData.$set = {};
    }
    updateData.$set.updatedAt = new Date();

    const res = await progress.findOneAndUpdate(
        { userId: new ObjectId(userId) },
        updateData,
        { returnDocument: 'after' }
    );
    return res;
}
