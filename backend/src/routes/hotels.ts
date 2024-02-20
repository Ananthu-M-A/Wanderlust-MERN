import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Hotel from '../models/hotel';
import { HotelType } from '../shared/types';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', verifyToken, [
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('City is required'),
    body("country").notEmpty().withMessage('Country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('pricePerNight is required, must be a number'),
    body("facilities").notEmpty().isArray().withMessage('Facilities is required'),
], upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            const imageUrls = await uploadImages(imageFiles);
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            const hotel = new Hotel(newHotel);
            await hotel.save();
            res.status(201).send(hotel);
        } catch (error) {
            console.log("Error creating hotel: ", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });


router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);

    } catch (error) {
        res.status(500).json({ message: "Error loading hotels" });
    }
});


router.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error loading hotels" });
    }
});


router.put('/:hotelid', verifyToken, upload.array("imageFiles"),
    async (req: Request, res: Response) => {
        try {
            const updatedHotel: HotelType = req.body;
            updatedHotel.lastUpdated = new Date();

            const hotel = await Hotel.findOneAndUpdate({
                _id: req.body.hotelId,
                userId: req.userId
            }, updatedHotel, { new: true });
            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            const files = req.files as Express.Multer.File[];
            const updatedImageUrls = await uploadImages(files);

            hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];
            await hotel.save();
            console.log(hotel);
            
            res.status(201).json(hotel);
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });

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

