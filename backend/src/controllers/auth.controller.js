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
exports.verifyResetPassword = exports.resetPassword = exports.loadUser = exports.userLogout = exports.userAuthorization = exports.userLogin = exports.verifyRegistration = exports.userRegistration = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const NodeMailer_1 = require("../utils/NodeMailer");
require("../interfaces/session.interface");
const userRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        const user = yield user_model_1.default.findOne({
            email: req.body.email,
        });
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }
        const generateOTP = () => {
            return crypto_1.default.randomInt(100000, 999999).toString();
        };
        const currentDate = new Date();
        const otpTimeout = 30;
        const otp = generateOTP();
        const otpExpiry = new Date(currentDate.getTime() + otpTimeout * 1000);
        const { email, mobile, password, firstName, lastName } = req.body;
        if (!req.session) {
            return res.status(400).json({ message: "Session not available" });
        }
        req.session.userSignupData = { email, mobile, password, firstName, lastName, otp, otpExpiry };
        const subject = `OTP Verification - [WANDERLUST]`;
        const bookingMail = `Your OTP is: ${otp}`;
        (0, NodeMailer_1.sendBookingMail)(res, req.session.userSignupData.email, subject, bookingMail);
        res.status(200).json({ status: "Success", message: "Registration Initiated!" });
    }
    catch (error) {
        console.log("Error in user registration", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.userRegistration = userRegistration;
const verifyRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enteredOtp = req.body.otp;
        const userSignupData = req.session.userSignupData;
        if (!userSignupData) {
            console.log("User data not found in session.");
            return res.status(400).json({ message: "Error in creating account.." });
        }
        const otpExpiry = new Date(userSignupData.otpExpiry);
        const currentTime = new Date();
        if (currentTime > otpExpiry) {
            console.log("OTP timeout");
            return res.status(400).json({ message: "OTP Timeout" });
        }
        if (enteredOtp === userSignupData.otp) {
            const { email, mobile, password, firstName, lastName } = userSignupData;
            const isBlocked = false;
            const user = new user_model_1.default({ email, mobile, password, firstName, lastName, isBlocked });
            yield user.save();
            if (user) {
                req.session.userSignupData = undefined;
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
                res.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 86400000
                });
                return res.status(200).send({ message: "User registered, OK" });
            }
            else {
                return res.status(400).json({ message: "Error creating account.." });
            }
        }
        else {
            console.log("Invalid OTP");
            res.status(400).json({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.log("Error verifying registration", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.verifyRegistration = verifyRegistration;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({
            email: email,
        });
        if (!user || user.role.includes("admin")) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        if (user.isBlocked) {
            return res.status(400).json({ message: "User not allowed!" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });
        return res.status(200).json({ userId: user._id });
    }
    catch (error) {
        console.log("Error in user login", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.userLogin = userLogin;
const userAuthorization = (req, res) => {
    try {
        res.status(200).send({ userId: req.userId });
    }
    catch (error) {
        console.log("Error authorizing user", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};
exports.userAuthorization = userAuthorization;
const userLogout = (req, res) => {
    try {
        res.cookie("auth_token", "", {
            expires: new Date(0),
        });
        res.send();
    }
    catch (error) {
        console.log("Error in user logout", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};
exports.userLogout = userLogout;
const loadUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_model_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        res.json(user);
    }
    catch (error) {
        console.log("Error loading user", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.loadUser = loadUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        const user = yield user_model_1.default.findOne({
            email: req.body.email,
        });
        if (!user) {
            return res.status(400).json({ message: "User does not exist!" });
        }
        const generateOTP = () => {
            return crypto_1.default.randomInt(100000, 999999).toString();
        };
        const currentDate = new Date();
        const otpTimeout = 30;
        const otp = generateOTP();
        const otpExpiry = new Date(currentDate.getTime() + otpTimeout * 1000);
        const { email, password } = req.body;
        if (!req.session) {
            return res.status(400).json({ message: "Session not available" });
        }
        req.session.userLoginData = { email, password, otp, otpExpiry };
        const subject = `OTP Verification - [WANDERLUST]`;
        const bookingMail = `Your passwor reset OTP is: ${otp}`;
        (0, NodeMailer_1.sendBookingMail)(res, req.session.userLoginData.email, subject, bookingMail);
        res.status(200).json({ status: "Success", message: "Password reset Initiated!" });
    }
    catch (error) {
        console.log("Error in resetting password", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.resetPassword = resetPassword;
const verifyResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enteredOtp = req.body.otp;
        const userLoginData = req.session.userLoginData;
        if (!userLoginData) {
            console.log("User data not found in session.");
            return res.status(400).json({ message: "Error in resetting password.." });
        }
        const otpExpiry = new Date(userLoginData.otpExpiry);
        const currentTime = new Date();
        if (currentTime > otpExpiry) {
            console.log("OTP timeout");
            return res.status(400).json({ message: "OTP Timeout" });
        }
        if (enteredOtp === userLoginData.otp) {
            const { email, password } = userLoginData;
            const user = yield user_model_1.default.findOne({ email });
            if (user) {
                user.password = password;
                yield user.save();
            }
            if (user) {
                req.session.userLoginData = undefined;
                return res.status(200).send({ message: "Reset Password, OK" });
            }
            else {
                return res.status(400).json({ message: "Error resetting password.." });
            }
        }
        else {
            console.log("Invalid OTP");
            res.status(400).json({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.log("Error verifying reset password", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.verifyResetPassword = verifyResetPassword;
