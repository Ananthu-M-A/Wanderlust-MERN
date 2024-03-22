import express from 'express';
import verifyAdminToken from '../middleware/adminAuth';
import { blockRestaurant, createRestaurant, loadRestaurant, loadRestaurants, unblockRestaurant, updateRestaurant } from '../controllers/restaurants.controller';
import { body } from 'express-validator';
import multer, { Multer } from 'multer';
const restaurantsRouter = express.Router();

const storage = multer.memoryStorage();
const upload: Multer = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

restaurantsRouter.get('/restaurants', verifyAdminToken, loadRestaurants);
restaurantsRouter.post('/restaurants/create-restaurant',
    [
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("country").notEmpty().withMessage('Country is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Type is required'),
        body("facilities").notEmpty().isArray().withMessage('Facilities is required'),
    ],
    upload.array("imageFiles", 3),
    verifyAdminToken, createRestaurant);
restaurantsRouter.get('/restaurants/:restaurantId', verifyAdminToken, loadRestaurant);
restaurantsRouter.put('/restaurants/:restaurantId/update',
    upload.array("imageFiles"),
    verifyAdminToken, updateRestaurant);
restaurantsRouter.put('/restaurants/:restaurantId/block', verifyAdminToken, blockRestaurant);
restaurantsRouter.put('/restaurants/:restaurantId/unblock', verifyAdminToken, unblockRestaurant);

export default restaurantsRouter;