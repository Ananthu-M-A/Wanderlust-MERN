import { BookingType, HotelType, UserType } from "../shared/types";

export const createBookingMail = (newBooking: BookingType, user: UserType, hotel: HotelType) => {
    const emailContent = `
    Dear ${user?.firstName} ${user?.lastName},

    We are thrilled to confirm your reservation at ${hotel?.name}! Your comfort and satisfaction are our top priorities, and we are excited to host you during your upcoming stay.

    Here are the details of your booking:

    Reservation ID: ${newBooking._id}
    Guest Name: ${user?.firstName} ${user?.lastName}
    Check-in Date: ${newBooking.checkIn}
    Check-out Date: ${newBooking.checkOut}
    Room Detail: ${newBooking.roomDetails.roomType}, ${newBooking.roomDetails.roomPrice}, ${newBooking.roomDetails.roomCount}
    Number of Guests: ${newBooking.adultCount + newBooking.childCount}

    Please review the information above to ensure everything is accurate. If there are any discrepancies or if you have any additional requests, please don't hesitate to contact us at http://localhost:5173/.

    As part of our commitment to providing exceptional service, we offer a range of amenities and facilities to enhance your stay. Whether you're looking to unwind by the pool, indulge in a delicious meal at our restaurant, or take advantage of our concierge services, we're here to make your experience memorable.

    Upon arrival, our friendly staff will be ready to assist you with the check-in process and answer any questions you may have. We want to ensure your stay is seamless and enjoyable from start to finish.

    Thank you for choosing ${hotel?.name}. We look forward to welcoming you and making your stay with us unforgettable.

    Warm regards,

    Administrator,
    ${hotel?.name}
    ${hotel?.city}, ${hotel?.country}`;

    return emailContent;
}