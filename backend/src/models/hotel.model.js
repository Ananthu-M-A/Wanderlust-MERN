"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hotelSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    roomTypes: [{
            type: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        }],
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    type: { type: String, required: true },
    facilities: [{ type: String, required: true }],
    starRating: { type: Number, required: true, min: 1, max: 5 },
    imageUrls: [{ type: String, required: true }],
    lastUpdated: { type: Date, required: true },
    isBlocked: { type: Boolean, required: true },
});
const Hotel = mongoose_1.default.model("Hotel", hotelSchema);
exports.default = Hotel;
