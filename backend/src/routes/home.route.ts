import express from "express";
import { loadHotelDetails, searchHotels, searchRestaurants } from "../controllers/home.controller";
import { param } from "express-validator";
const homeRouter = express.Router();

homeRouter.get('/search-hotels', searchHotels);
homeRouter.get('/search-hotels/:hotelId',
    [param("hotelId").notEmpty().withMessage("Hotel id required")], loadHotelDetails);
homeRouter.get('/search-restaurants', searchRestaurants);


export default homeRouter;