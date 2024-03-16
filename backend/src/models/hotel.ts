import mongoose from "mongoose";
import { BookingType, HotelType } from "../shared/types";

export const bookingSchema = new mongoose.Schema<BookingType>({
    userId: { type: String, required: true },
    bookingEmail: { type: String, required: true },
    hotelName: { type: String, required: true },
    hotelImageUrl: { type: String, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    roomDetail: { type: String, required: true },
    totalCost: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    paymentId: { type: String }
})

const hotelSchema = new mongoose.Schema<HotelType>({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    roomTypes: [{
        type: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
    }],
    type: { type: String, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    facilities: [{ type: String, required: true }],
    starRating: { type: Number, required: true, min: 1, max: 5 },
    imageUrls: [{ type: String, required: true }],
    lastUpdated: { type: Date, required: true },
    bookings: [bookingSchema],
    isBlocked: { type: Boolean, required: true },
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
const Booking = mongoose.model<BookingType>("Booking", bookingSchema);

export { Hotel, Booking };
