import { ObjectId } from "mongodb";
import { db } from "../db/mongodb.js";

export async function createUserDAL(userName, email, password, fullName, role) {
    const users = db.collection("users");
    const user = { userName, email, password, fullName, role, createdAt: new Date(), updatedAt: new Date() };
    const res = await users.insertOne(user);
    user._id = res.insertedId;
    return user;
}

export async function getUserByEmailDAL(email) {
    const users = db.collection("users");
    const cleanEmail = email ? email.trim() : '';
    const res = await users.findOne({ 
        email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } 
    });
    return res;
}

export async function getUserByIdDAL(id) {
    const users = db.collection("users");
    const res = await users.findOne({ _id: new ObjectId(id) });
    return res;
}
