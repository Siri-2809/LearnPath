import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Database Connection
import connectDB from "../config/db.js";

// Models
import User from "../models/User.js";
import Company from "../models/Company.js";
import Subject from "../models/Subject.js";
import Question from "../models/Question.js";
import Resource from "../models/Resource.js";

// Data Files
import companies from "../data/companies.json" assert { type: "json" };
import subjects from "../data/subjects.json" assert { type: "json" };
import questions from "../data/questions.json" assert { type: "json" };
import resources from "../data/resources.json" assert { type: "json" };

/**
 * Import Data into Database
 */
const importData = async () => {
    try {
        await connectDB();

        // Clear Existing Data
        await User.deleteMany();
        await Company.deleteMany();
        await Subject.deleteMany();
        await Question.deleteMany();
        await Resource.deleteMany();

        console.log("🗑️ Existing data cleared...");

        // Insert Fresh Data
        await Company.insertMany(companies);
        await Subject.insertMany(subjects);
        await Question.insertMany(questions);
        await Resource.insertMany(resources);

        // Create Admin User
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@learnpath.com",
            password: "admin123",
            role: "admin"
        });

        console.log("👤 Admin user created:");
        console.log("   Email: admin@learnpath.com");
        console.log("   Password: admin123");

        console.log("✅ Data Imported Successfully!");
        process.exit();
    } catch (error) {
        console.error(`❌ Error Importing Data: ${error.message}`);
        process.exit(1);
    }
};

/**
 * Destroy Data from Database
 */
const destroyData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Company.deleteMany();
        await Subject.deleteMany();
        await Question.deleteMany();
        await Resource.deleteMany();

        console.log("🗑️ Data Destroyed Successfully!");
        process.exit();
    } catch (error) {
        console.error(`❌ Error Destroying Data: ${error.message}`);
        process.exit(1);
    }
};

// Command Line Arguments
if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}