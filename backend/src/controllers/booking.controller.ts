import { Request, Response } from "express";
import "dotenv/config";
import Booking from "../models/booking.model";
import Hotel from "../models/hotel.model";
import User from "../models/user.model";
import { sendBookingMail } from '../utils/NodeMailer';
import { BookingType } from "../shared/types";
import { createPDF } from "../utils/PDF Creator";
import { createBookingMail } from "../utils/BookingMailCreator";
import { Attachment } from "nodemailer/lib/mailer";
import { SessionUserData } from '../interfaces/SessionInterface';
import { retrievePaymentId, sessionPayment } from "../utils/StripePayment";

interface CustomRequest extends Request {
    userId: string;
}

export const checkout = async (req: Request, res: Response) => {
    try {
        const { hotelId, restaurantId } = req.body;
        if (hotelId) {
            const paymentData = req.body;
            const existingBookings = await Booking.find({
                categoryId: paymentData.hotelId,
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
            const hotelData = await Hotel.findOne({ _id: paymentData.hotelId });

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
            const hotel = await Hotel.findById(paymentData.hotelId);
            if (hotel) {
                const name = `${hotel.name}, ${hotel.city}, ${hotel.country}`;
                const description = `
            Rooms: ${paymentData.roomType} Bed, ₹${paymentData.roomPrice}, ${paymentData.roomCount}Nos, 
            Guests: ${paymentData.adultCount} Adults, ${paymentData.childCount} Children, 
            Check-In: ${paymentData.checkIn.toDateString},
            Check-Out: ${paymentData.checkOut.toDateString}`;
                const unit_amount = paymentData.roomPrice * paymentData.nightsPerStay * 100;
                const quantity = paymentData.roomCount;
                const success_url = `${process.env.BACKEND_URL}/api/user/booking/payment-result?session_id={CHECKOUT_SESSION_ID}`;
                const cancel_url = `${process.env.FRONTEND_URL}`;
                sessionPayment(req, res, name, description, unit_amount, quantity, success_url, cancel_url);
            }
        } else if (restaurantId) {
            // const paymentData = req.body;
            // const existingBookings = await Booking.find({
            //     categoryId: paymentData.restaurantId,
            //     bookingStatus: { $ne: `cancelled` },
            //     $or: [
            //         { $and: [{ bookedDate: { $lt: paymentData.dateOfBooking } }, { checkOut: { $gt: paymentData.dateOfBooking } }] },
            //     ]
            // });

            // let totalBookedRooms = 0;
            // existingBookings.forEach(booking => {
            //     if (booking.roomDetails.roomType === paymentData.roomType) {
            //         totalBookedRooms += booking.roomDetails.roomCount;
            //     }
            // });
            // const hotelData = await Hotel.findOne({ _id: paymentData.hotelId });

            // if (hotelData) {
            //     const roomData = hotelData.roomTypes.find(room => room.type === paymentData.roomType);
            //     if (roomData) {
            //         const remainingRooms = roomData.quantity - totalBookedRooms;
            //         if (remainingRooms < paymentData.roomCount) {
            //             return res.status(500).json({ error: "Requirement unavailable" });
            //         }
            //     }
            // }

            // req.session.paymentData = paymentData;
            // const hotel = await Hotel.findById(paymentData.hotelId);
            // if (hotel) {
            //     const name = `${hotel.name}, ${hotel.city}, ${hotel.country}`;
            //     const description = `
            // Rooms: ${paymentData.roomType} Bed, ₹${paymentData.roomPrice}, ${paymentData.roomCount}Nos, 
            // Guests: ${paymentData.adultCount} Adults, ${paymentData.childCount} Children, 
            // Check-In: ${paymentData.checkIn.toDateString},
            // Check-Out: ${paymentData.checkOut.toDateString}`;
            //     const unit_amount = paymentData.roomPrice * paymentData.nightsPerStay * 100;
            //     const quantity = paymentData.roomCount;
            //     const success_url = `${process.env.BACKEND_URL}/api/user/booking/payment-result?session_id={CHECKOUT_SESSION_ID}`;
            //     const cancel_url = `${process.env.FRONTEND_URL}`;
            //     sessionPayment(req, res, name, description, unit_amount, quantity, success_url, cancel_url);
            // }
        }

    } catch (error: any) {
        console.log("Error in booking", error.message);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const loadCheckoutResult = async (req: CustomRequest, res: Response) => {
    try {
        const sessionId = req.query.session_id;
        const paymentIntentId = await retrievePaymentId(sessionId);
        const paymentData = req.session.paymentData;
        const roomDetails = {
            roomType: paymentData.roomType,
            roomPrice: paymentData.roomPrice,
            roomCount: paymentData.roomCount
        }
        const newBooking = new Booking({
            userId: req.userId,
            categoryId: paymentData.hotelId,
            adultCount: paymentData.adultCount,
            childCount: paymentData.childCount,
            checkIn: paymentData.checkIn,
            checkOut: paymentData.checkOut,
            roomDetails,
            totalCost: paymentData.roomPrice * paymentData.nightsPerStay * paymentData.roomCount,
            paymentId: paymentIntentId,
            bookingDate: new Date(),
            bookingStatus: "active",
        });
        await newBooking.save();

        const user = await User.findOne({ _id: req.userId });
        const hotel = await Hotel.findOne({ _id: paymentData.hotelId });
        if (hotel && user && newBooking) {
            createPDF(newBooking, user, hotel);
            const recipientEmail = user.email;
            const subject = `Confirmation of Your Hotel Booking - [${newBooking._id}]`;
            const attachments: Attachment[] = [{
                filename: `wanderlust_booking_id_${newBooking._id}.pdf`,
                path: `wanderlust_booking_id_${newBooking._id}.pdf`
            }];
            const emailContent = createBookingMail(newBooking, user, hotel);
            sendBookingMail(res, recipientEmail, subject, emailContent, attachments);
            res.redirect(`${process.env.FRONTEND_URL}/home/${newBooking._id}/order-result-page`)
        }

    } catch (error: any) {
        console.log("Error in saving booking data", error.message);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const bookings = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.query;
        let allBookings: BookingType[] = [];

        if (bookingId && (bookingId?.length === 24)) {
            const bookings = await Booking.find({ _id: bookingId }).populate("categoryId");
            allBookings = bookings;

        } else {
            const bookings = await Booking.find().populate("categoryId");
            allBookings = bookings;
        }

        const sortedBookings = allBookings
            .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
            .slice(0, 4);
        res.json(sortedBookings);
    } catch (error: any) {
        console.log("Error in loading user bookings", error.message);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const date = new Date().toDateString();
        const updateBooking = await Booking.findOneAndUpdate({ _id: bookingId }, { bookingStatus: 'cancelled', cancellationDate: date }, { new: true });
        res.json(updateBooking);

    } catch (error: any) {
        console.log("Error in cancelling user booking", error.message);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};