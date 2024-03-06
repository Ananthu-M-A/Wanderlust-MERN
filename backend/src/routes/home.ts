import express, { Request, Response } from 'express';
import Hotel from '../models/hotel';
import { BookingType, SearchResponse, UserType } from '../shared/types';
import { param, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import Stripe from "stripe";
import verifyToken from '../middleware/auth';
import User from '../models/user';
import cloudinary from 'cloudinary';
import multer from 'multer';

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
        const file = req.file;
        console.log(file);
        
        try {
            const user = await User.findById({ _id: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else {
                const { password }: UserType = req.body;
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    const { firstName, lastName, email, mobile }: UserType = req.body;
                    const updatedUser = await User.findOneAndUpdate({ _id: req.userId },
                        { firstName, lastName, email, mobile }, { new: true });
                    if (updatedUser) {
                        if (req.file) {
                            const file = req.file;
                            console.log(file);
                            const updatedImageUrl = await uploadImage(file);
                            console.log(updatedImageUrl);
                            updatedUser.imageUrl = updatedImageUrl;
                        }
                        await updatedUser.save();
                        res.status(201).json(updatedUser);
                    }
                }
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
        // switch (req.query.sortOption) {
        //     case "starRating":
        //         sortOption = { starRating: -1 }; break;
        //     case "pricePerNightAsc":
        //         sortOption = { pricePerNight: 1 }; break;
        //     case "pricePerNightDesc":
        //         sortOption = { pricePerNight: -1 }; break;

        // }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = await Hotel.find({ ...query, isBlocked: false }).sort(sortOption).skip(skip).limit(pageSize);
        const total = await Hotel.countDocuments({ ...query, isBlocked: false });
        const response: SearchResponse = {
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

router.post("/:hotelId/bookings/payment-intent", verifyToken,
    async (req: Request, res: Response) => {

        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }

        // const totalCost = hotel.pricePerNight * numberOfNights;
        const totalCost = 0

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost,
            currency: "inr",
            metadata: {
                hotelId,
                userId: req.userId,
            },
        });

        if (!paymentIntent.client_secret) {
            return res.status(500).json({ message: "Error creating payment intent" });
        }

        const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret.toString(),
            totalCost,
        };

        res.send(response);
    }
);

router.get('/:hotelId/bookings', verifyToken,
    async (req: Request, res: Response) => {
        try {
            const paymentIntentId = req.body.paymentIntentId;
            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId as string
            );

            if (!paymentIntent) {
                return res.status(400).json({ message: "Payment intent not found" });
            }

            if (paymentIntent.metadata.hotelId !== req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId) {
                return res.status(400).json({ message: "Payment intent mismatch" });
            }

            if (paymentIntent.status !== "succeeded") {
                return res.status(400)
                    .json({ message: `Payment intent not succeeded. Status: ${paymentIntent.status}` });
            }

            const newBooking: BookingType = {
                ...req.body,
                userId: req.userId,
            }

            const hotel = await Hotel.findOneAndUpdate(
                { _id: req.params.hotelId },
                {
                    $push: { bookings: newBooking },
                }
            );

            if (!hotel) {
                return res.status(400).json({ message: "Hotel not found" });
            }

            await hotel.save();
            res.status(200).send();

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
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

    // if (queryParams.maxPrice) {
    //     constructedQuery.pricePerNight = {
    //         $lte: parseInt(queryParams.maxPrice).toString(),
    //     };
    // }

    return constructedQuery
};

export default router;

async function uploadImage(imageFile: Express.Multer.File) {
    const imageBase64 = Buffer.from(imageFile.buffer).toString("base64");
    let dataURI = "data:" + imageFile.mimetype + ";base64," + imageBase64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
}
