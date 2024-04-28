"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_auth_middleware_1 = __importDefault(require("../middlewares/user.auth.middleware"));
const booking_controller_1 = require("../controllers/booking.controller");
const bookingRouter = express_1.default.Router();
bookingRouter.post('/checkout', user_auth_middleware_1.default, booking_controller_1.checkout);
bookingRouter.get('/payment-result', user_auth_middleware_1.default, booking_controller_1.loadCheckoutResult);
bookingRouter.get('/bookings', user_auth_middleware_1.default, booking_controller_1.bookings);
bookingRouter.get('/:bookingId/receipt', user_auth_middleware_1.default, booking_controller_1.downloadDoc);
bookingRouter.put('/:bookingId/cancel', user_auth_middleware_1.default, booking_controller_1.cancelBooking);
exports.default = bookingRouter;
