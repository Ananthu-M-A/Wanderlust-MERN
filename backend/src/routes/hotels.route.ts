import express from 'express';
import verifyAdminToken from '../middleware/adminAuth';
import { blockHotel, createHotel, loadHotel, loadHotels, unblockHotel, updateHotel } from '../controllers/hotels.controller';
import { body } from 'express-validator';
import multer, { Multer } from 'multer';
const hotelsRouter = express.Router();

const storage = multer.memoryStorage();
const upload: Multer = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

hotelsRouter.get('/', verifyAdminToken, loadHotels);
hotelsRouter.post('/create-hotel',
    [
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("country").notEmpty().withMessage('Country is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Type is required'),
        body("facilities").notEmpty().isArray().withMessage('Facilities is required'),
    ],
    upload.array("imageFiles", 3),
    verifyAdminToken, createHotel);
hotelsRouter.get('/:hotelId', verifyAdminToken, loadHotel);
hotelsRouter.put('/:hotelId/update',
    upload.array("imageFiles"),
    verifyAdminToken, updateHotel);
hotelsRouter.put('/:hotelId/block', verifyAdminToken, blockHotel);
hotelsRouter.put('/:hotelId/unblock', verifyAdminToken, unblockHotel);


export default hotelsRouter;