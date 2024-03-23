import PDFKit from 'pdfkit';
import fs from 'fs';
import { BookingType, HotelType, UserType } from '../shared/types';

export const createPDF = (newBooking: BookingType, user: UserType | null, hotel: HotelType) => {
    try {
        const doc = new PDFKit();

        const stream = fs.createWriteStream(`wanderlust_booking_id_${newBooking._id}.pdf`);
        doc.pipe(stream);

        doc.fontSize(12).text('Booking Receipt', { align: 'center' }).moveDown();
        doc.fontSize(10).text(`Guest Name: ${user?.firstName} ${user?.lastName}`).moveDown();
        doc.text(`Hotel Name: ${hotel?.name}`).moveDown();
        doc.text(`Adult Count: ${newBooking.adultCount}`).moveDown();
        doc.text(`Child Count: ${newBooking.childCount}`).moveDown();
        doc.text(`Check-In: ${newBooking.checkIn}`).moveDown();
        doc.text(`Check-Out: ${newBooking.checkOut}`).moveDown();
        doc.text(`Room Detail: ${newBooking.roomDetails.roomType} Bed Room, ₹${newBooking.roomDetails.roomPrice}, ${newBooking.roomDetails.roomCount} Nos`).moveDown();
        doc.text(`Total Cost: ₹ ${newBooking.totalCost}`).moveDown();
        doc.text(`Payment Status: Successfull`).moveDown();
        doc.text(`Booking Date: ${newBooking.bookingDate}`).moveDown();

        doc.end();

        return stream;

    } catch (error: any) {
        console.log("Error creating PDF", error.message);
    }
}