import express from 'express';
import verifyToken from "../middleware/auth";
import { bookings, cancelBooking, checkout, loadCheckoutResult } from '../controllers/booking.controller';
const bookingRouter = express.Router();

bookingRouter.post('/checkout', verifyToken, checkout);
bookingRouter.get('/:userId/payment-result', verifyToken, loadCheckoutResult);
bookingRouter.get('/bookings', verifyToken, bookings);
bookingRouter.put('/:bookingId/cancel', verifyToken, cancelBooking);

export default bookingRouter;