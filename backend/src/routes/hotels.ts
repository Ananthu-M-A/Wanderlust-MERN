import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { Booking, Hotel } from '../models/hotel';
import { BookingType, HotelType, RoomType, SearchHotelResponse } from '../shared/types';
import { body } from 'express-validator';
import verifyAdminToken from '../middleware/adminAuth';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', verifyAdminToken, [
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('City is required'),
    body("country").notEmpty().withMessage('Country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Type is required'),
    body("facilities").notEmpty().isArray().withMessage('Facilities is required'),
], upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel = req.body;

            const imageUrls = await uploadImages(imageFiles);

            const roomTypes: RoomType[] = [];
            for (let i = 0; i < 5; i++) {
                if (newHotel[`room[${i}].type`] && newHotel[`room[${i}].price`] && newHotel[`room[${i}].quantity`]) {
                    const roomType: RoomType = {
                        type: newHotel[`room[${i}].type`],
                        price: parseInt(newHotel[`room[${i}].price`]),
                        quantity: parseInt(newHotel[`room[${i}].quantity`])
                    };
                    roomTypes.push(roomType);
                }
            }

            const newHotelData: HotelType = {
                _id: newHotel._id,
                name: newHotel.name,
                city: newHotel.city,
                country: newHotel.country,
                description: newHotel.description,
                roomTypes,
                type: newHotel.type,
                adultCount: parseInt(newHotel.adultCount),
                childCount: parseInt(newHotel.childCount),
                facilities: newHotel.facilities,
                starRating: parseInt(newHotel.starRating),
                imageUrls,
                lastUpdated: new Date(),
                bookings: [],
                isBlocked: false
            };

            const saveHotel = async (hotelData: HotelType) => {
                const hotel = new Hotel(hotelData);
                await hotel.save();
                return hotel;
            };

            const savedHotel = await saveHotel(newHotelData);
            res.status(201).json(savedHotel);
        } catch (error) {
            console.log("Error creating hotel: ", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });


router.get('/load-orders-table', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.query;
        let allBookings: BookingType[] = [];

        if (bookingId) {
            const booking = await Booking.findOne({ _id: bookingId });
            if (booking) {
                allBookings.push(booking);
            }
        } else {
            const hotelsWithBookings = await Hotel.find({}).populate("bookings");
            hotelsWithBookings.forEach((hotel: HotelType) => {
                hotel.bookings.forEach((booking: BookingType) => {
                    allBookings.push(booking);
                });
            });
        }

        const sortedOrders = allBookings
            .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
            .slice(0, 10);
        res.json(sortedOrders);
    } catch (error) {
        console.error("Error loading bookings:", error);
        res.status(500).json({ message: "Failed to load bookings" });
    }
});


router.get('/', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);

        const pageSize = 10;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = await Hotel.find(query).skip(skip).limit(pageSize);
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



router.put('/:hotelId/block', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const hotelId = req.params.hotelId;
        const hotel = (await Hotel.findOneAndUpdate({ _id: hotelId }, { isBlocked: true }, { new: true }))
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error updating hotel" });
    }
});


router.put('/:hotelId/unblock', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const hotelId = req.params.hotelId;
        const hotel = (await Hotel.findOneAndUpdate({ _id: hotelId }, { isBlocked: false }, { new: true }))
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error updating hotel" });
    }
});


router.get('/:id', verifyAdminToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
        });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error loading hotels" });
    }
});


router.put('/:hotelid', verifyAdminToken, upload.array("imageFiles"),
    async (req: Request, res: Response) => {
        try {
            const updatedHotel: HotelType = req.body;
            updatedHotel.lastUpdated = new Date();

            const hotel = await Hotel.findOneAndUpdate({
                _id: req.body.hotelId,
            }, updatedHotel, { new: true });
            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            const files = req.files as Express.Multer.File[];
            const updatedImageUrls = await uploadImages(files);
            hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

            await hotel.save();

            res.status(201).json(hotel);
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { name: new RegExp(queryParams.destination, "i") },
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }
    return constructedQuery
};

export default router;

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadImages = imageFiles.map(async (image) => {
        const imageBase64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + imageBase64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadImages);
    return imageUrls;
}
