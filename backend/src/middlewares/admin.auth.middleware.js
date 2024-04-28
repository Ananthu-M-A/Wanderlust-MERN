"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../interfaces/session.interface");
const verifyAdminToken = (req, res, next) => {
    try {
        const token = req.cookies["admin_token"];
        if (!token) {
            console.log("Admin unauthorized");
            return res.status(401).json({ message: "Admin unauthorized" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.adminId = decoded.adminId;
        next();
    }
    catch (error) {
        console.log("Admin unauthorized");
        return res.status(401).json({ message: "Admin unauthorized" });
    }
};
exports.default = verifyAdminToken;
