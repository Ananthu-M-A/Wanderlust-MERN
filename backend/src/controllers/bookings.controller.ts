import { Request, Response } from 'express';
import Booking from '../models/booking.model';

export const loadBookings = async (req: Request, res: Response) => {
    try {
        const queries = req.query;
        let query = {};
        if (queries.bookingId && queries.bookingId.length === 24) {
            query = { _id: queries.bookingId };
        }
        const pageSize = 10;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;

        const bookings = await Booking.find({ ...query }).skip(skip).limit(pageSize).populate("categoryId");
        const total = await Booking.countDocuments({ ...query, isBlocked: false });

        const response = {
            data: bookings,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };

        res.json(response);
    } catch (error: any) {
        console.log("Error in loading user bookings table", error.message);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const loadBookingDetails = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const bookingDetails = await Booking.findOne({ _id: bookingId }).populate('categoryId');
        res.json(bookingDetails);
    } catch (error: any) {
        console.log("Error in loading user booking details", error.message);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};