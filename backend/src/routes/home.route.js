"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const home_controller_1 = require("../controllers/home.controller");
const express_validator_1 = require("express-validator");
const homeRouter = express_1.default.Router();
homeRouter.get('/search-hotels', home_controller_1.searchHotels);
homeRouter.get('/search-hotels/:hotelId', [(0, express_validator_1.param)("hotelId").notEmpty().withMessage("Hotel id required")], home_controller_1.loadHotelDetails);
homeRouter.get('/search-restaurants', home_controller_1.searchRestaurants);
exports.default = homeRouter;
