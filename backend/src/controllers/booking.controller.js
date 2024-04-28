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
exports.downloadDoc = exports.cancelBooking = exports.bookings = exports.loadCheckoutResult = exports.checkout = void 0;
require("dotenv/config");
const booking_model_1 = __importDefault(require("../models/booking.model"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const NodeMailer_1 = require("../utils/NodeMailer");
const PDF_Creator_1 = require("../utils/PDF Creator");
const BookingMailCreator_1 = require("../utils/BookingMailCreator");
const StripePayment_1 = require("../utils/StripePayment");
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
require("../interfaces/session.interface");
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId, restaurantId } = req.body;
        if (hotelId) {
            const paymentData = req.body;
            const existingBookings = yield booking_model_1.default.find({
                hotelId: paymentData.hotelId,
                bookingStatus: { $ne: `cancelled` },
                $or: [
                    { $and: [{ checkIn: { $lt: paymentData.checkOut } }, { checkOut: { $gt: paymentData.checkIn } }] },
                    { $and: [{ checkIn: { $gte: paymentData.checkIn } }, { checkOut: { $lte: paymentData.checkOut } }] }
                ]
            });
            let totalBookedRooms = 0;
            existingBookings.forEach(booking => {
                if (booking.roomDetails.roomType === paymentData.roomType) {
                    totalBookedRooms += booking.roomDetails.roomCount;
                }
            });
            const hotelData = yield hotel_model_1.default.findOne({ _id: paymentData.hotelId });
            if (hotelData) {
                const roomData = hotelData.roomTypes.find(room => room.type === paymentData.roomType);
                if (roomData) {
                    const remainingRooms = roomData.quantity - totalBookedRooms;
                    if (remainingRooms < paymentData.roomCount) {
                        return res.status(500).json({ error: "Requirement unavailable" });
                    }
                }
            }
            req.session.paymentData = paymentData;
            const hotel = yield hotel_model_1.default.findById(paymentData.hotelId);
            if (hotel) {
                const name = `${hotel.name}, ${hotel.city}, ${hotel.country}`;
                const description = `
            Rooms: ${paymentData.roomType} Bed, ₹${paymentData.roomPrice}, ${paymentData.roomCount}Nos, 
            Guests: ${paymentData.adultCount} Adults, ${paymentData.childCount} Children, 
            Check-In: ${paymentData.checkIn.toLocaleString()},
            Check-Out: ${paymentData.checkOut.toLocaleString()}`;
                const unit_amount = paymentData.roomPrice * paymentData.nightsPerStay * 100;
                const quantity = paymentData.roomCount;
                const success_url = `${process.env.BACKEND_URL}/api/user/booking/payment-result?session_id={CHECKOUT_SESSION_ID}`;
                const cancel_url = `${process.env.FRONTEND_URL}`;
                (0, StripePayment_1.sessionPayment)(req, res, name, description, unit_amount, quantity, success_url, cancel_url);
            }
        }
        else if (restaurantId) {
            const paymentData = req.body;
            const date = new Date(paymentData.dateOfBooking);
            date.setHours(0, 0, 0, 0);
            const result = yield booking_model_1.default.aggregate([
                {
                    $match: {
                        "foodDetails.foodItem": paymentData.foodItem,
                        // "dateOfBooking": { $eq: date }
                    }
                },
                {
                    $group: {
                        _id: "$foodDetails.foodItem",
                        totalGuests: { $sum: "$guestCount" }
                    }
                }
            ]);
            if (result.length > 0) {
                if (result[0].totalGuests >= paymentData.foodCount)
                    console.log(result[0].totalGuests);
                return res.status(500).json({ error: "Requirement unavailable" });
            }
            req.session.paymentData = paymentData;
            const restaurant = yield restaurant_model_1.default.findById(paymentData.restaurantId);
            if (restaurant) {
                const name = `${restaurant.name}, ${restaurant.city}, ${restaurant.country}`;
                const description = `
            Food Item: ${paymentData.foodItem} of ₹${paymentData.foodPrice} for ${paymentData.guestCount} guests, 
            Date of Booking: ${paymentData.dateOfBooking.toLocaleString()}`;
                const unit_amount = paymentData.foodPrice * 100;
                const quantity = paymentData.guestCount;
                const success_url = `${process.env.BACKEND_URL}/api/user/booking/payment-result?session_id={CHECKOUT_SESSION_ID}`;
                const cancel_url = `${process.env.FRONTEND_URL}`;
                (0, StripePayment_1.sessionPayment)(req, res, name, description, unit_amount, quantity, success_url, cancel_url);
            }
        }
    }
    catch (error) {
        console.log("Error in booking", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.checkout = checkout;
const loadCheckoutResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId, restaurantId } = req.session.paymentData;
        if (hotelId) {
            const paymentData = req.session.paymentData;
            const sessionId = req.query.session_id;
            const paymentIntentId = yield (0, StripePayment_1.retrievePaymentId)(sessionId);
            const roomDetails = {
                roomType: paymentData.roomType,
                roomPrice: paymentData.roomPrice,
                roomCount: paymentData.roomCount
            };
            const newBooking = new booking_model_1.default({
                userId: req.userId,
                hotelId: paymentData.hotelId,
                adultCount: paymentData.adultCount,
                childCount: paymentData.childCount,
                checkIn: new Date(paymentData.checkIn).toDateString(),
                checkOut: new Date(paymentData.checkOut).toDateString(),
                roomDetails,
                totalCost: paymentData.roomPrice * paymentData.nightsPerStay * paymentData.roomCount,
                paymentId: paymentIntentId,
                bookingDate: new Date(),
                bookingStatus: "active",
            });
            yield newBooking.save();
            const user = yield user_model_1.default.findOne({ _id: req.userId });
            const hotel = yield hotel_model_1.default.findOne({ _id: paymentData.hotelId });
            if (hotel && user && newBooking) {
                (0, PDF_Creator_1.createPDF)(newBooking, user, hotel);
                const recipientEmail = user.email;
                const subject = `Confirmation of Your Hotel Booking - [${newBooking._id}]`;
                const attachments = [{
                        filename: `wanderlust_booking_id_${newBooking._id}.pdf`,
                        path: `wanderlust_booking_id_${newBooking._id}.pdf`
                    }];
                const emailContent = (0, BookingMailCreator_1.createBookingMail)(newBooking, user, hotel);
                if (emailContent) {
                    (0, NodeMailer_1.sendBookingMail)(res, recipientEmail, subject, emailContent, attachments);
                    res.redirect(`${process.env.FRONTEND_URL}/home/${newBooking._id}/order-result-page`);
                }
            }
        }
        else if (restaurantId) {
            const paymentData = req.session.paymentData;
            const sessionId = req.query.session_id;
            const paymentIntentId = yield (0, StripePayment_1.retrievePaymentId)(sessionId);
            const foodDetails = {
                foodItem: paymentData.foodItem,
                foodPrice: paymentData.foodPrice,
                foodCount: paymentData.foodCount
            };
            const newBooking = new booking_model_1.default({
                userId: req.userId,
                restaurantId: paymentData.restaurantId,
                guestCount: paymentData.guestCount,
                dateOfBooking: new Date(paymentData.dateOfBooking).toDateString(),
                foodDetails,
                totalCost: paymentData.foodPrice * paymentData.guestCount,
                paymentId: paymentIntentId,
                bookingDate: new Date().toDateString(),
                bookingStatus: "active",
            });
            yield newBooking.save();
            const user = yield user_model_1.default.findOne({ _id: req.userId });
            const restaurant = yield restaurant_model_1.default.findOne({ _id: paymentData.restaurantId });
            if (restaurant && user && newBooking) {
                (0, PDF_Creator_1.createPDF)(newBooking, user, undefined, restaurant);
                const recipientEmail = user.email;
                const subject = `Confirmation of Your Restaurant Booking - [${newBooking._id}]`;
                const attachments = [{
                        filename: `wanderlust_booking_id_${newBooking._id}.pdf`,
                        path: `wanderlust_booking_id_${newBooking._id}.pdf`
                    }];
                const emailContent = (0, BookingMailCreator_1.createBookingMail)(newBooking, user, undefined, restaurant);
                if (emailContent) {
                    (0, NodeMailer_1.sendBookingMail)(res, recipientEmail, subject, emailContent, attachments);
                    res.redirect(`${process.env.FRONTEND_URL}/home/${newBooking._id}/order-result-page`);
                }
            }
        }
    }
    catch (error) {
        console.log("Error in saving booking data", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.loadCheckoutResult = loadCheckoutResult;
const bookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingsToUpdate = yield booking_model_1.default.find({
            $or: [
                { checkIn: { $lte: today } },
                { dateOfBooking: { $lte: today } }
            ],
            bookingStatus: { $ne: "Booking Confirmed" }
        });
        yield Promise.all(bookingsToUpdate.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
            booking.bookingStatus = "Booking Confirmed";
            yield booking.save();
        })));
        const { bookingId } = req.query;
        let allBookings = [];
        if (bookingId && ((bookingId === null || bookingId === void 0 ? void 0 : bookingId.length) === 24)) {
            const bookings = yield booking_model_1.default.find({ _id: bookingId }).populate("hotelId").populate("restaurantId");
            allBookings = bookings;
        }
        else {
            const bookings = yield booking_model_1.default.find().populate("hotelId").populate("restaurantId");
            allBookings = bookings;
        }
        const sortedBookings = allBookings
            .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
            .slice(0, 4);
        res.json(sortedBookings);
    }
    catch (error) {
        console.log("Error in loading user bookings", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.bookings = bookings;
const cancelBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId } = req.params;
        const date = new Date().toDateString();
        const updateBooking = yield booking_model_1.default.findOneAndUpdate({ _id: bookingId }, { bookingStatus: 'cancelled', cancellationDate: date }, { new: true });
        res.json(updateBooking);
    }
    catch (error) {
        console.log("Error in cancelling user booking", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.cancelBooking = cancelBooking;
const downloadDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId } = req.params;
        const booking = yield booking_model_1.default.findOne({ _id: bookingId });
        if (!booking) {
            res.status(404).send({ message: "Booking not found" });
            return;
        }
        const hotel = yield hotel_model_1.default.findOne({ _id: booking.hotelId });
        const restaurant = yield restaurant_model_1.default.findOne({ _id: booking.restaurantId });
        const user = yield user_model_1.default.findOne({ _id: req.userId });
        if (user && hotel && booking) {
            const pdfPath = (0, PDF_Creator_1.createPDF)(booking, user, hotel);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=wanderlust_booking_id_${bookingId}.pdf`);
            res.send(pdfPath);
        }
        if (user && booking && restaurant) {
            const pdfPath = (0, PDF_Creator_1.createPDF)(booking, user, undefined, restaurant);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=wanderlust_booking_id_${bookingId}.pdf`);
            res.send(pdfPath);
        }
    }
    catch (error) {
        console.log("Error in downloading payment receipt", error);
        res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.downloadDoc = downloadDoc;
