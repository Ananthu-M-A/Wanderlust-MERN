import express, { Request, Response } from 'express';
import Hotel from '../models/hotel';
import { BookingType, HotelType, SearchHotelResponse, UserType } from '../shared/types';
import { param, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import Stripe from "stripe";
import verifyToken from '../middleware/auth';
import User from '../models/user';
import cloudinary from 'cloudinary';
import multer from 'multer';
import Booking from '../models/booking';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.get("/load-account", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});


router.put('/updateProfile', verifyToken, upload.single("imageFile"),
    async (req: Request, res: Response) => {
        const userId = req.userId;
        try {
            const user = await User.findById({ _id: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const { password }: UserType = req.body;
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Enter correct password" });
            }

            const { firstName, lastName, email, mobile }: UserType = req.body;
            const updatedUser = await User.findOneAndUpdate({ _id: req.userId },
                { firstName, lastName, email, mobile }, { new: true });

            if (updatedUser) {
                if (req.file) {
                    const file = req.file as Express.Multer.File;
                    const updatedImageUrl = await uploadImage(file);
                    updatedUser.imageUrl = updatedImageUrl;
                }
                await updatedUser.save();
                res.status(201).json(updatedUser);
            } else {
                res.status(500).json({ message: "Error updating profile" });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });


router.get('/search', async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);
        let sortOption = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOption = { starRating: -1 }; break;
            case "pricePerNightAsc":
                sortOption = { ['roomTypes.price']: 1 }; break;
            case "pricePerNightDesc":
                sortOption = { ['roomTypes.price']: -1 }; break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = await Hotel.find({ ...query, isBlocked: false }).sort(sortOption).skip(skip).limit(pageSize);
        const total = await Hotel.countDocuments({ ...query, isBlocked: false });
        const response: SearchHotelResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };
        res.json(response);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.get('/load-bookings', verifyToken, async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error("Error loading bookings:", error);
        res.status(500).json({ message: "Failed to load bookings" });
    }
});

router.put('/cancel-booking/:bookingId', verifyToken, async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const date = new Date().toDateString();
        const updateBooking = await Booking.findOneAndUpdate({ _id: bookingId }, { bookingStatus: `cancelled on ${date}` }, { new: true });
        res.json(updateBooking);

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Failed to cancel bookings" });
    }
})

router.get('/:userId/order-result-page', verifyToken, async (req: Request, res: Response) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId as any);
        const paymentData = req.session.paymentData;
        const paymentIntentId = session.payment_intent;
        const newBooking = new Booking({
            userId: req.params.userId,
            categoryId: paymentData.hotelId,
            adultCount: paymentData.adultCount,
            childCount: paymentData.childCount,
            checkIn: paymentData.checkIn,
            checkOut: paymentData.checkOut,
            roomDetail: `${paymentData.roomType} Bed, ₹${paymentData.roomPrice}, ${paymentData.roomCount}Nos`,
            totalCost: paymentData.roomPrice * paymentData.nightsPerStay * paymentData.roomCount,
            paymentId: paymentIntentId,
            bookingDate: new Date(),
            bookingStatus: "active",
        });
        await newBooking.save();
        res.redirect(`http://localhost:5173/home/${newBooking._id}/order-result-page`)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error booking hotel" });
    }
});

router.get('/:id',
    [param("id").notEmpty().withMessage("Hotel id required")],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const id = req.params.id.toString();
        try {
            const hotel = await Hotel.findById(id);
            res.json(hotel);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error loading hotel" });
        }
    })


router.post('/create-checkout-session', verifyToken,
    async (req: Request, res: Response) => {
        const paymentData = req.body;
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
                success_url: `http://localhost:4000/api/home/${req.userId}/order-result-page?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: "http://localhost:5173",
            });
            res.json({ id: session.id });
        } catch (error) {
            console.error("Error creating checkout session:", error);
            res.status(500).json({ error: "Failed to create checkout session" });
        }
    }
);


const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
            { name: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount)
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount)
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities]
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types]
        }
    }

    if (queryParams.stars) {
        constructedQuery.starRating = {
            $in: Array.isArray(queryParams.stars)
                ? queryParams.stars
                : [queryParams.stars]
        }
    }

    if (queryParams.maxPrice) {
        constructedQuery['roomTypes.price'] = {
            $lte: parseInt(queryParams.maxPrice)
        };
    }

    return constructedQuery
};

export default router;

async function uploadImage(imageFile: Express.Multer.File) {
    const imageBase64 = Buffer.from(imageFile.buffer).toString("base64");
    let dataURI = "data:" + imageFile.mimetype + ";base64," + imageBase64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
}
