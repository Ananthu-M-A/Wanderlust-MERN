import mongoose from "mongoose";
import { RestaurantType } from "../shared/types";
import { bookingSchema } from "./hotel";

const restaurantSchema = new mongoose.Schema<RestaurantType>({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    foodItems: [{
        item: { type: String, required: true },
        price: { type: Number, required: true },
        availability: { type: String, required: true },
    }],
    type: { type: String, required: true},
    starRating: { type: Number, required: true },
    openingHours: [{
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }],
    facilities: [{ type: String, required: true }],
    imageUrls: [{ type: String, required: true }],
    lastUpdated: { type: Date, required: true },
    bookings: [bookingSchema],
    isBlocked: { type: Boolean, required: true },
});

const Restaurant = mongoose.model<RestaurantType>("Restaurant", restaurantSchema);

export default Restaurant;
