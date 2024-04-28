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
exports.updateProfile = exports.loadProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const CloudinaryUploader_1 = require("../utils/CloudinaryUploader");
const loadProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        res.json(user);
    }
    catch (error) {
        console.log("Error in loading user profile", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.loadProfile = loadProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_model_1.default.findById({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password } = req.body;
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Enter correct password" });
        }
        const { firstName, lastName, email, mobile } = req.body;
        const updatedUser = yield user_model_1.default.findOneAndUpdate({ _id: req.userId }, { firstName, lastName, email, mobile }, { new: true });
        if (updatedUser) {
            if (req.file) {
                const file = req.file;
                const updatedImageUrl = yield (0, CloudinaryUploader_1.uploadImage)(file);
                updatedUser.imageUrl = updatedImageUrl;
            }
            yield updatedUser.save();
            res.status(201).json(updatedUser);
        }
        else {
            res.status(500).json({ message: "Error updating profile" });
        }
    }
    catch (error) {
        console.log("Error in updating user profile", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.updateProfile = updateProfile;
