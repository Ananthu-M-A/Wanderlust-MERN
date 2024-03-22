import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import session from 'express-session';
import authRouter from './routes/auth.route';
import adminRouter from './routes/admin.route';
import usersRouter from './routes/users.route';
import hotelsRouter from './routes/hotels.route';
import bookingsRouter from './routes/bookings.route';
import profileRouter from './routes/profile.route';
import homeRouter from './routes/home.route';
import bookingRouter from './routes/booking.route';

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
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET || "Secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000,
    },
}));

app.use("/api/user", authRouter);
app.use("/api/user/profile", profileRouter);
app.use("/api/user/home", homeRouter);
app.use("/api/user/booking", bookingRouter);

app.use("/api/admin", adminRouter);
app.use("/api/admin/users", usersRouter);
app.use("/api/admin/hotels", hotelsRouter);
app.use("/api/admin/bookings", bookingsRouter);

app.listen(4000, () => {
    console.log("Server started on port 4000.");
});