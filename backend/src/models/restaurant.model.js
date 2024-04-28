"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const restaurantSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    foodItems: [{
            item: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        }],
    type: { type: String, required: true },
    starRating: { type: Number, required: true },
    openingHours: [{
            day: { type: String, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true }
        }],
    facilities: [{ type: String, required: true }],
    imageUrls: [{ type: String, required: true }],
    lastUpdated: { type: Date, required: true },
    isBlocked: { type: Boolean, required: true },
});
const Restaurant = mongoose_1.default.model("Restaurant", restaurantSchema);
exports.default = Restaurant;
