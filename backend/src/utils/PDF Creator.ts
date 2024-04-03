import PDFKit from 'pdfkit';
import fs from 'fs';
import { BookingType, HotelType, RestaurantType, UserType } from '../../../types/types';

export const createPDF = async (newBooking: BookingType, user: UserType, hotel?: HotelType, restaurant?: RestaurantType) => {
    try {
        const doc = new PDFKit();

        const stream = fs.createWriteStream(`wanderlust_booking_id_${newBooking._id}.pdf`);
        doc.pipe(stream);

        doc.fontSize(12).text('Booking Receipt', { align: 'center' }).moveDown();
        doc.fontSize(10).text(`Guest Name: ${user?.firstName} ${user?.lastName}`).moveDown();
        hotel && doc.text(`Hotel Name: ${hotel?.name}`).moveDown();
        restaurant && doc.text(`Restaurant Name: ${restaurant?.name}`).moveDown();
        hotel && doc.text(`Adult Count: ${newBooking.adultCount}`).moveDown();
        hotel && doc.text(`Child Count: ${newBooking.childCount}`).moveDown();
        hotel && doc.text(`Check-In: ${newBooking.checkIn}`).moveDown();
        hotel && doc.text(`Check-Out: ${newBooking.checkOut}`).moveDown();
        restaurant && doc.text(`Booked Date: ${newBooking.dateOfBooking}`).moveDown();
        hotel && doc.text(`Room Details: ${newBooking.roomDetails.roomType} Bed Room, ₹${newBooking.roomDetails.roomPrice}, ${newBooking.roomDetails.roomCount} Nos`).moveDown();
        restaurant && doc.text(`Food Details: ${newBooking.foodDetails.foodItem} of price ₹${newBooking.foodDetails.foodPrice} for ${newBooking.guestCount} guests`).moveDown();
        doc.text(`Total Cost: ₹ ${newBooking.totalCost}`).moveDown();
        doc.text(`Payment Status: Successfull`).moveDown();
        doc.text(`Booking Date: ${newBooking.bookingDate}`).moveDown();

        doc.end();

        return stream;
        // return doc;

    } catch (error) {
        console.log("Error creating PDF", error);
    }
}