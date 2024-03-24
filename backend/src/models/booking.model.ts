import mongoose, { Types } from "mongoose";
import { BookingType } from "../shared/types";

const bookingSchema = new mongoose.Schema<BookingType>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Types.ObjectId, ref: "Hotel", required: true },
    adultCount: { type: Number },
    childCount: { type: Number },
    guestCount: { type: Number },
    checkIn: { type: Date },
    checkOut: { type: Date },
    bookedDate: { type: Date },
    roomDetails: {
        roomType: { type: String },
        roomPrice: { type: Number },
        roomCount: { type: Number },
    },
    foodDetails: { type: String },
    totalCost: { type: Number, required: true },
    paymentId: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    bookingStatus: { type: String },
    cancellationDate: { type: Date }
})

const Booking = mongoose.model<BookingType>("Booking", bookingSchema);

export default Booking;