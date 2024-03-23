import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
        console.log("Database is connected");
    } catch (error: any) {
        console.log("Error connecting database:", error.message);
    }
}