import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";
import env from "./utils/env";

const PORT = env.PORT || 3001;

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
