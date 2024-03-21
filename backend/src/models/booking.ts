import mongoose, { Types } from "mongoose";
import { BookingType } from "../shared/types";

const bookingSchema = new mongoose.Schema<BookingType>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Types.ObjectId, ref: "Hotel", required: true },
    adultCount: { type: Number },
    childCount: { type: Number },
    checkIn: { type: Date },
    checkOut: { type: Date },
    roomDetails: {
        roomType: { type: String },
        roomPrice: { type: Number },
        roomCount:{ type: Number },
    },
    totalCost: { type: Number, required: true },
    paymentId: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    bookingStatus: { type: String },
})

const Booking = mongoose.model<BookingType>("Booking", bookingSchema);

export default Booking;