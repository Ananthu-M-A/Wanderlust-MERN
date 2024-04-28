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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../interfaces/session.interface");
const user_model_1 = __importDefault(require("../models/user.model"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies["auth_token"];
        if (!token) {
            console.log("User unauthorized");
            return res.status(401).json({ message: "User unauthorized" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const userActivityStatus = yield user_model_1.default.findOne({ _id: decoded.userId }, { isBlocked: 1, _id: 0 });
        if ((userActivityStatus && userActivityStatus.isBlocked)) {
            console.log("User blocked");
            return res.status(401).json({ message: "User blocked" });
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.log("User unauthorized", error);
        return res.status(401).json({ message: "User unauthorized" });
    }
});
exports.default = verifyToken;
