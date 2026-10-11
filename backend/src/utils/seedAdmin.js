import { db } from "../db/mongodb.js";
import { passwordHash } from "./bcryptPassword.js";

export async function seedAdminIfEmpty() {
    try {
        const usersCollection = db.collection("users");
        const hashedPassword = await passwordHash("admin123");
        
        await usersCollection.updateOne(
            { email: "admin@admin.com" },
            {
                $set: {
                    userName: "admin",
                    fullName: "System Administrator",
                    email: "admin@admin.com",
                    password: hashedPassword,
                    role: "admin",
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
        console.log("==========================================");
        console.log("Admin account verified & active!");
        console.log("Email: admin@admin.com | Password: admin123");
        console.log("==========================================");
    } catch (err) {
        console.error("Error seeding admin user:", err.message);
    }
}
