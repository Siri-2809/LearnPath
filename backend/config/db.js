import mongoose from "mongoose";

/**
 * Connect to MongoDB
 * Uses environment variable MONGO_URI from .env
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "learnpath",
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;