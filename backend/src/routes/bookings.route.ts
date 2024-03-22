import express from 'express';
import verifyAdminToken from '../middleware/adminAuth';
import { loadBookingDetails, loadBookings } from '../controllers/bookings.controller';

const bookingsRouter = express.Router();

bookingsRouter.get('/', verifyAdminToken, loadBookings);
bookingsRouter.get('/:bookingId', verifyAdminToken, loadBookingDetails);

export default bookingsRouter;