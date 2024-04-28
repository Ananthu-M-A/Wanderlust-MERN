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
exports.unblockRestaurant = exports.blockRestaurant = exports.updateRestaurant = exports.loadRestaurant = exports.createRestaurant = exports.loadRestaurants = void 0;
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
const CloudinaryUploader_1 = require("../utils/CloudinaryUploader");
const SearchQuery_1 = require("../utils/SearchQuery");
const loadRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = (0, SearchQuery_1.bookingBotSearchQuery)(req.query);
        const pageSize = 10;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = yield restaurant_model_1.default.find(query).skip(skip).limit(pageSize);
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
        console.log("Error in loading restaurants table", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.loadRestaurants = loadRestaurants;
const createRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFiles = req.files;
        const newRestaurant = req.body;
        const imageUrls = yield (0, CloudinaryUploader_1.uploadImages)(imageFiles);
        const openingHours = [];
        for (let i = 0; i < 7; i++) {
            if (newRestaurant[`opening[${i}].day`] && newRestaurant[`opening[${i}].startTime`] && newRestaurant[`opening[${i}].endTime`]) {
                const openingHour = {
                    day: newRestaurant[`opening[${i}].day`],
                    startTime: newRestaurant[`opening[${i}].startTime`],
                    endTime: newRestaurant[`opening[${i}].endTime`]
                };
                openingHours.push(openingHour);
            }
        }
        const foodItems = [];
        for (let i = 0; i < 10; i++) {
            if (newRestaurant[`food[${i}].item`] && newRestaurant[`food[${i}].price`] && newRestaurant[`food[${i}].quantity`]) {
                const foodItem = {
                    item: newRestaurant[`food[${i}].item`],
                    price: newRestaurant[`food[${i}].price`],
                    quantity: newRestaurant[`food[${i}].quantity`]
                };
                foodItems.push(foodItem);
            }
        }
        const newRestaurantData = {
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
        const saveRestaurant = (restaurantData) => __awaiter(void 0, void 0, void 0, function* () {
            const restaurant = new restaurant_model_1.default(restaurantData);
            yield restaurant.save();
            return restaurant;
        });
        const savedRestaurant = yield saveRestaurant(newRestaurantData);
        res.status(201).json(savedRestaurant);
    }
    catch (error) {
        console.log("Error in creating restaurant", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.createRestaurant = createRestaurant;
const loadRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.restaurantId.toString();
        const restaurant = yield restaurant_model_1.default.findOne({
            _id: id,
        });
        res.json(restaurant);
    }
    catch (error) {
        console.log("Error in loading restaurant details", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.loadRestaurant = loadRestaurant;
const updateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRestaurant = req.body;
        updatedRestaurant.lastUpdated = new Date();
        const restaurant = yield restaurant_model_1.default.findOneAndUpdate({
            _id: req.body.restaurantId,
        }, updatedRestaurant, { new: true });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const files = req.files;
        const updatedImageUrls = yield (0, CloudinaryUploader_1.uploadImages)(files);
        restaurant.imageUrls = [...updatedImageUrls, ...(updatedRestaurant.imageUrls || [])];
        yield restaurant.save();
        res.status(201).json(restaurant);
    }
    catch (error) {
        console.log("Error in updating restaurant", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.updateRestaurant = updateRestaurant;
const blockRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = (yield restaurant_model_1.default.findOneAndUpdate({ _id: restaurantId }, { isBlocked: true }, { new: true }));
        res.json(restaurant);
    }
    catch (error) {
        console.log("Error in blocking restaurant", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.blockRestaurant = blockRestaurant;
const unblockRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = (yield restaurant_model_1.default.findOneAndUpdate({ _id: restaurantId }, { isBlocked: false }, { new: true }));
        res.json(restaurant);
    }
    catch (error) {
        console.log("Error in unblocking restaurant", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.unblockRestaurant = unblockRestaurant;
