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
exports.adminLogout = exports.adminAuthorization = exports.adminLogin = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("../interfaces/session.interface");
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        const { email, password } = req.body;
        const admin = yield user_model_1.default.findOne({
            email: email,
        });
        if (!admin || !admin.role.includes("admin")) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });
        return res.status(200).json({ adminId: admin._id });
    }
    catch (error) {
        console.log("Error in admin login", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.adminLogin = adminLogin;
const adminAuthorization = (req, res) => {
    try {
        res.status(200).send({ adminId: req.adminId });
    }
    catch (error) {
        console.log("Error in authorizing admin", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};
exports.adminAuthorization = adminAuthorization;
const adminLogout = (req, res) => {
    try {
        res.cookie("admin_token", "", {
            expires: new Date(0),
        });
        res.send();
    }
    catch (error) {
        console.log("Error in admin logout", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};
exports.adminLogout = adminLogout;
