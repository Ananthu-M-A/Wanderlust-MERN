import { Request, Response } from "express";
import Booking from "../models/booking";
import Hotel from "../models/hotel";
import User from "../models/user";
import Stripe from "stripe";
import { transporter } from '../utils/NodeMailer';
import PDFKit from 'pdfkit';
import fs from 'fs';
import { BookingType } from "../shared/types";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export const checkout = async (req: Request, res: Response) => {
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
    const user = await User.findById(req.userId);
    const bookingData = [{
        price_data: {
            currency: "inr",
            product_data: {
                name: `${user?.firstName} ${user?.lastName}`,
                description: `Hotel: ${hotel?.name}, ${hotel?.city}, ${hotel?.country},
                    Rooms: ${paymentData.roomType} Bed, ₹${paymentData.roomPrice}, ${paymentData.roomCount}Nos, 
                    Guests: ${paymentData.adultCount} Adults, ${paymentData.childCount} Children, 
                    Check-In: ${paymentData.checkIn},
                    Check-Out: ${paymentData.checkOut}`
            },
            unit_amount: paymentData.roomPrice * paymentData.nightsPerStay * 100,
        },
        quantity: paymentData.roomCount,
    }];
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: bookingData,
            mode: "payment",
            success_url: `http://localhost:4000/api/user/booking/${req.userId}/payment-result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:5173",
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
};

export const loadCheckoutResult = async (req: Request, res: Response) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId as any);
        const paymentData = req.session.paymentData;
        const paymentIntentId = session.payment_intent;
        const roomDetails = {
            roomType: paymentData.roomType,
            roomPrice: paymentData.roomPrice,
            roomCount: paymentData.roomCount
        }
        const newBooking = new Booking({
            userId: req.params.userId,
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

        const user = await User.findOne({ _id: req.params.userId });
        const hotel = await Hotel.findOne({ _id: paymentData.hotelId });

        const doc = new PDFKit();

        const stream = fs.createWriteStream(`wanderlust_booking_id_${newBooking._id}.pdf`);
        doc.pipe(stream);

        doc.fontSize(12).text('Booking Receipt', { align: 'center' }).moveDown();
        doc.fontSize(10).text(`Guest Name: ${user?.firstName} ${user?.lastName}`).moveDown();
        doc.text(`Hotel Name: ${hotel?.name}`).moveDown();
        doc.text(`Adult Count: ${newBooking.adultCount}`).moveDown();
        doc.text(`Child Count: ${newBooking.childCount}`).moveDown();
        doc.text(`Check-In: ${newBooking.checkIn}`).moveDown();
        doc.text(`Check-Out: ${newBooking.checkOut}`).moveDown();
        doc.text(`Room Detail: ${newBooking.roomDetails.roomType} Bed Room, ₹${newBooking.roomDetails.roomPrice}, ${newBooking.roomDetails.roomCount} Nos`).moveDown();
        doc.text(`Total Cost: ₹${newBooking.totalCost}`).moveDown();
        doc.text(`Payment Status: Successfull`).moveDown();
        doc.text(`Booking Date: ${newBooking.bookingDate}`).moveDown();

        doc.end();

        const emailContent = `
        Dear ${user?.firstName} ${user?.lastName},

We are thrilled to confirm your reservation at ${hotel?.name}! Your comfort and satisfaction are our top priorities, and we are excited to host you during your upcoming stay.

Here are the details of your booking:

Reservation ID: ${newBooking._id}
Guest Name: ${user?.firstName} ${user?.lastName}
Check-in Date: ${newBooking.checkIn}
Check-out Date: ${newBooking.checkOut}
Room Detail: ${newBooking.roomDetails.roomType}, ${newBooking.roomDetails.roomPrice}, ${newBooking.roomDetails.roomCount}
Number of Guests: ${newBooking.adultCount + newBooking.childCount}

Please review the information above to ensure everything is accurate. If there are any discrepancies or if you have any additional requests, please don't hesitate to contact us at http://localhost:5173/.

As part of our commitment to providing exceptional service, we offer a range of amenities and facilities to enhance your stay. Whether you're looking to unwind by the pool, indulge in a delicious meal at our restaurant, or take advantage of our concierge services, we're here to make your experience memorable.

Upon arrival, our friendly staff will be ready to assist you with the check-in process and answer any questions you may have. We want to ensure your stay is seamless and enjoyable from start to finish.

Thank you for choosing ${hotel?.name}. We look forward to welcoming you and making your stay with us unforgettable.

Warm regards,

Administrator,
${hotel?.name}
${hotel?.city}, ${hotel?.country}`;

        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: user?.email,
            subject: `Confirmation of Your Hotel Booking - [${newBooking._id}]`,
            text: emailContent,
            attachments: [
                {
                    filename: `wanderlust_booking_id_${newBooking._id}.pdf`,
                    path: `wanderlust_booking_id_${newBooking._id}.pdf`
                }
            ]
        };

        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.log(error);
                const errorMsg = "Error sending booking details & pdf";
                res.status(400).json({ message: errorMsg });
            } else {
                console.log('OTP email sent:', info.response);
            }
        });
        res.redirect(`http://localhost:5173/home/${newBooking._id}/order-result-page`)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error booking hotel" });
    }
};

export const bookings = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.query;
        console.log(bookingId);

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
    } catch (error) {
        console.error("Error loading bookings:", error);
        res.status(500).json({ message: "Failed to load bookings" });
    }
};

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const date = new Date().toDateString();
        const updateBooking = await Booking.findOneAndUpdate({ _id: bookingId }, { bookingStatus: 'cancelled', cancellationDate: date }, { new: true });
        res.json(updateBooking);

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Failed to cancel bookings" });
    }
};