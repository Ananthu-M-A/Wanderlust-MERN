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
exports.createPDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const createPDF = (newBooking, user, hotel, restaurant) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new pdfkit_1.default();
        const stream = fs_1.default.createWriteStream(`wanderlust_booking_id_${newBooking._id}.pdf`);
        doc.pipe(stream);
        doc.fontSize(12).text('Booking Receipt', { align: 'center' }).moveDown();
        doc.fontSize(10).text(`Guest Name: ${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`).moveDown();
        hotel && doc.text(`Hotel Name: ${hotel === null || hotel === void 0 ? void 0 : hotel.name}`).moveDown();
        restaurant && doc.text(`Restaurant Name: ${restaurant === null || restaurant === void 0 ? void 0 : restaurant.name}`).moveDown();
        hotel && doc.text(`Adult Count: ${newBooking.adultCount}`).moveDown();
        hotel && doc.text(`Child Count: ${newBooking.childCount}`).moveDown();
        hotel && doc.text(`Check-In: ${new Date(newBooking.checkIn).toLocaleDateString()} 02:00:00 PM`).moveDown();
        hotel && doc.text(`Check-Out: ${new Date(newBooking.checkOut).toLocaleDateString()} 12:00:00 PM`).moveDown();
        restaurant && doc.text(`Booked Date: ${new Date(newBooking.dateOfBooking).toLocaleDateString()} 02:00:00 PM`).moveDown();
        hotel && doc.text(`Room Details: ${newBooking.roomDetails.roomType} Bed Room, ₹${newBooking.roomDetails.roomPrice}, ${newBooking.roomDetails.roomCount} Nos`).moveDown();
        restaurant && doc.text(`Food Details: ${newBooking.foodDetails.foodItem} of price ₹${newBooking.foodDetails.foodPrice} for ${newBooking.guestCount} guests`).moveDown();
        doc.text(`Total Cost: ₹ ${newBooking.totalCost}`).moveDown();
        doc.text(`Payment Status: Successfull`).moveDown();
        doc.text(`Booking Date: ${new Date(newBooking.bookingDate).toLocaleDateString()}`).moveDown();
        doc.end();
        return stream;
        // return doc;
    }
    catch (error) {
        console.log("Error creating PDF", error);
    }
});
exports.createPDF = createPDF;
