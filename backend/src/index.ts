import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import hotelRoutes from './routes/hotels';
import homeRoutes from './routes/home';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
        console.log("Database is connected");
    } catch (error: any) {
        console.log(error.message);
    }
}
connectDb();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/home", homeRoutes);

app.listen(4000, () => {
    console.log("Server started on port 4000.");
});