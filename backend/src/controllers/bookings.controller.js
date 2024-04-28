"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBookingDetails = exports.loadBookings = void 0;
const booking_model_1 = __importDefault(require("../models/booking.model"));
const loadBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queries = req.query;
        let query = {};
        if (queries.bookingId && queries.bookingId.length === 24) {
            query = { _id: queries.bookingId };
        }
        const pageSize = 10;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const bookings = yield booking_model_1.default.find(Object.assign({}, query)).skip(skip).limit(pageSize).populate("hotelId").populate("restaurantId");
        const total = yield booking_model_1.default.countDocuments(Object.assign(Object.assign({}, query), { isBlocked: false }));
        const response = {
            data: bookings,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };
        res.json(response);
    }
    catch (error) {
        console.log("Error in loading user bookings table", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.loadBookings = loadBookings;
const loadBookingDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId } = req.params;
        const bookingDetails = yield booking_model_1.default.findOne({ _id: bookingId }).populate("hotelId").populate("restaurantId");
        res.json(bookingDetails);
    }
    catch (error) {
        console.log("Error in loading user booking details", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.loadBookingDetails = loadBookingDetails;
