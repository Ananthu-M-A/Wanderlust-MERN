import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { FoodItem, OpeningHour, RestaurantType, RoomType } from '../shared/types';
import { body } from 'express-validator';
import verifyAdminToken from '../middleware/adminAuth';
import Restaurant from '../models/restaurant';

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
            const newRestaurant = req.body;     
                   
            const imageUrls = await uploadImages(imageFiles);

            const openingHours: OpeningHour[] = [];
            for (let i = 0; i < 7; i++) {
                if (newRestaurant[`opening[${i}].day`] && newRestaurant[`opening[${i}].startTime`] && newRestaurant[`opening[${i}].endTime`]) {
                    const openingHour: OpeningHour = {
                        day: newRestaurant[`opening[${i}].day`],
                        startTime: newRestaurant[`opening[${i}].startTime`],
                        endTime: newRestaurant[`opening[${i}].endTime`]
                    };
                    openingHours.push(openingHour);
                }
            }            

            const foodItems: FoodItem[] = [];
            for (let i = 0; i < 10; i++) {
                if (newRestaurant[`food[${i}].item`] && newRestaurant[`food[${i}].price`] && newRestaurant[`food[${i}].availability`]) {
                    const foodItem: FoodItem = {
                        item: newRestaurant[`food[${i}].item`],
                        price: newRestaurant[`food[${i}].price`],
                        availability: newRestaurant[`food[${i}].availability`]
                    };
                    foodItems.push(foodItem);
                }
            }

            const newRestaurantData: RestaurantType = {
                _id: newRestaurant._id,
                name: newRestaurant.name,
                city: newRestaurant.city,
                country: newRestaurant.country,
                description: newRestaurant.description,
                openingHours,
                type: newRestaurant.type,
                facilities: newRestaurant.facilities,
                starRating: parseInt(newRestaurant.starRating),
                imageUrls,
                lastUpdated: new Date(),
                bookings: [],
                isBlocked: false,
                foodItems,
            };

            const saveRestaurant = async (restaurantData: RestaurantType) => {
                const restaurant = new Restaurant(restaurantData);
                await restaurant.save();
                return restaurant;
            };

            const savedRestaurant = await saveRestaurant(newRestaurantData);
            res.status(201).json(savedRestaurant);
        } catch (error) {
            console.log("Error creating restaurant: ", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });



router.get('/', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);

    } catch (error) {
        res.status(500).json({ message: "Error loading restaurants" });
    }
});


router.put('/:restaurantId/block', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = (await Restaurant.findOneAndUpdate({ _id: restaurantId }, { isBlocked: true }, { new: true }))
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Error updating restaurant" });
    }
});


router.put('/:restaurantId/unblock', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = (await Restaurant.findOneAndUpdate({ _id: restaurantId }, { isBlocked: false }, { new: true }))
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Error updating restaurant" });
    }
});


router.get('/:id', verifyAdminToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const restaurant = await Restaurant.findOne({
            _id: id,
        });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Error loading restaurants" });
    }
});


router.put('/:restaurantid', verifyAdminToken, upload.array("imageFiles"),
    async (req: Request, res: Response) => {
        try {
            const updatedRestaurant: RestaurantType = req.body;
            updatedRestaurant.lastUpdated = new Date();

            const restaurant = await Restaurant.findOneAndUpdate({
                _id: req.body.restaurantId,
            }, updatedRestaurant, { new: true });
            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }

            const files = req.files as Express.Multer.File[];
            const updatedImageUrls = await uploadImages(files);
            restaurant.imageUrls = [...updatedImageUrls, ...(updatedRestaurant.imageUrls || [])];

            await restaurant.save();

            res.status(201).json(restaurant);
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
