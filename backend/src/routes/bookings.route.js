"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_auth_middleware_1 = __importDefault(require("../middlewares/admin.auth.middleware"));
const bookings_controller_1 = require("../controllers/bookings.controller");
const bookingsRouter = express_1.default.Router();
bookingsRouter.get('/', admin_auth_middleware_1.default, bookings_controller_1.loadBookings);
bookingsRouter.get('/:bookingId', admin_auth_middleware_1.default, bookings_controller_1.loadBookingDetails);
exports.default = bookingsRouter;
