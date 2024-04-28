"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRestaurants = exports.loadHotelDetails = exports.searchHotels = void 0;
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
const express_validator_1 = require("express-validator");
const SearchQuery_1 = require("../utils/SearchQuery");
const searchHotels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = (0, SearchQuery_1.constructSearchHotelQuery)(req.query);
        let sortOption = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOption = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOption = { ['roomTypes.price']: 1 };
                break;
            case "pricePerNightDesc":
                sortOption = { ['roomTypes.price']: -1 };
                break;
        }
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = yield hotel_model_1.default.find(Object.assign(Object.assign({}, query), { isBlocked: false })).sort(sortOption).skip(skip).limit(pageSize);
        const total = yield hotel_model_1.default.countDocuments(Object.assign(Object.assign({}, query), { isBlocked: false }));
        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };
        res.json(response);
    }
    catch (error) {
        console.log("Error in searching hotels", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.searchHotels = searchHotels;
const loadHotelDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.hotelId.toString();
        const hotel = yield hotel_model_1.default.findById(id);
        res.json(hotel);
    }
    catch (error) {
        console.log("Error in loading hotel details", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.loadHotelDetails = loadHotelDetails;
const searchRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = (0, SearchQuery_1.bookingBotSearchQuery)(req.query);
        let sortOption = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOption = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOption = { ['foodItems.price']: 1 };
                break;
            case "pricePerNightDesc":
                sortOption = { ['foodItems.price']: -1 };
                break;
        }
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = yield restaurant_model_1.default.find(Object.assign(Object.assign({}, query), { isBlocked: false })).sort(sortOption).skip(skip).limit(pageSize);
        const total = yield restaurant_model_1.default.countDocuments(Object.assign(Object.assign({}, query), { isBlocked: false }));
        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };
        res.json(response);
    }
    catch (error) {
        console.log("Error in searching restaurants", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.searchRestaurants = searchRestaurants;
