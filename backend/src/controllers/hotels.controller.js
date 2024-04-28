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
exports.unblockHotel = exports.blockHotel = exports.updateHotel = exports.loadHotel = exports.createHotel = exports.loadHotels = void 0;
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const CloudinaryUploader_1 = require("../utils/CloudinaryUploader");
const SearchQuery_1 = require("../utils/SearchQuery");
const loadHotels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = (0, SearchQuery_1.constructSearchHotelQuery)(req.query);
        const pageSize = 10;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = yield hotel_model_1.default.find(query).skip(skip).limit(pageSize);
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
        console.log("Error in loading hotels table", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.loadHotels = loadHotels;
const createHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFiles = req.files;
        const newHotel = req.body;
        const imageUrls = yield (0, CloudinaryUploader_1.uploadImages)(imageFiles);
        const roomTypes = [];
        for (let i = 0; i < 5; i++) {
            if (newHotel[`room[${i}].type`] && newHotel[`room[${i}].price`] && newHotel[`room[${i}].quantity`]) {
                const roomType = {
                    type: newHotel[`room[${i}].type`],
                    price: parseInt(newHotel[`room[${i}].price`]),
                    quantity: parseInt(newHotel[`room[${i}].quantity`]),
                };
                roomTypes.push(roomType);
            }
        }
        const newHotelData = {
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
            isBlocked: false
        };
        const saveHotel = (hotelData) => __awaiter(void 0, void 0, void 0, function* () {
            const hotel = new hotel_model_1.default(hotelData);
            yield hotel.save();
            return hotel;
        });
        const savedHotel = yield saveHotel(newHotelData);
        res.status(201).json(savedHotel);
    }
    catch (error) {
        console.log("Error in creating hotel", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.createHotel = createHotel;
const loadHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotelId = req.params.hotelId.toString();
        const hotel = yield hotel_model_1.default.findOne({
            _id: hotelId,
        });
        res.json(hotel);
    }
    catch (error) {
        console.log("Error in loading hotel details", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.loadHotel = loadHotel;
const updateHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedHotel = req.body;
        updatedHotel.lastUpdated = new Date();
        const hotel = yield hotel_model_1.default.findOneAndUpdate({
            _id: req.body.hotelId,
        }, updatedHotel, { new: true });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const files = req.files;
        const updatedImageUrls = yield (0, CloudinaryUploader_1.uploadImages)(files);
        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];
        yield hotel.save();
        res.status(201).json(hotel);
    }
    catch (error) {
        console.log("Error in updating hotels", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.updateHotel = updateHotel;
const blockHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotelId = req.params.hotelId;
        const hotel = (yield hotel_model_1.default.findOneAndUpdate({ _id: hotelId }, { isBlocked: true }, { new: true }));
        res.json(hotel);
    }
    catch (error) {
        console.log("Error in blocking hotel", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.blockHotel = blockHotel;
const unblockHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotelId = req.params.hotelId;
        const hotel = (yield hotel_model_1.default.findOneAndUpdate({ _id: hotelId }, { isBlocked: false }, { new: true }));
        res.json(hotel);
    }
    catch (error) {
        console.log("Error in unblocking hotel", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.unblockHotel = unblockHotel;
