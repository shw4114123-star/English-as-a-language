import { ObjectId } from "mongodb";
import { db } from "../db/mongodb.js";

export async function createLessonDAL(lessonData) {
    const lessons = db.collection("lessons");
    lessonData.createdAt = new Date();
    lessonData.updatedAt = new Date();
    const res = await lessons.insertOne(lessonData);
    lessonData._id = res.insertedId;
    return lessonData;
}

export async function getAllLessonsDAL() {
    const lessons = db.collection("lessons");
    const res = await lessons.find().toArray();
    return res;
}

export async function getLessonByIdDAL(id) {
    const lessons = db.collection("lessons");
    const res = await lessons.findOne({ _id: new ObjectId(id) });
    return res;
}

export async function updateLessonByIdDAL(id, updateData) {
    const lessons = db.collection("lessons");
    updateData.updatedAt = new Date();
    const res = await lessons.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
    );
    return res;
}

export async function deleteLessonByIdDAL(id) {
    const lessons = db.collection("lessons");
    const res = await lessons.findOneAndDelete({ _id: new ObjectId(id) });
    return res;
}
