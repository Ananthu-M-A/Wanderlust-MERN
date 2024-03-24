import { BookingType, HotelType, RestaurantType, UserType } from "../../../types/types";

export const createBookingMail = (newBooking: BookingType, user: UserType, hotel?: HotelType, restaurant?: RestaurantType) => {
    const emailContent = `
    Dear ${user?.firstName} ${user?.lastName},

    We are thrilled to confirm your reservation at ${hotel?.name || restaurant?.name}! Your comfort and satisfaction are our top priorities, and we are excited to host you during your upcoming visit.

    Here are the details of your booking:

    Reservation ID: ${newBooking._id}
    Guest Name: ${user?.firstName} ${user?.lastName}
    ${hotel && `Check-in Date: ${newBooking.checkIn}`}
    ${hotel && `Check-out Date: ${newBooking.checkOut}`}
    ${restaurant && `Booked Date: ${newBooking.dateOfBooking}`}
    ${hotel && `Room Detail: ${newBooking.roomDetails.roomType}, ${newBooking.roomDetails.roomPrice}, ${newBooking.roomDetails.roomCount}`}
    ${restaurant && `Food Detail: ${newBooking.foodDetails.foodItem}, ${newBooking.foodDetails.foodPrice}, ${newBooking.guestCount}`}
    ${hotel && `Number of Guests: ${newBooking.adultCount + newBooking.childCount}`}
    ${restaurant && `Number of Guests: ${newBooking.guestCount}`}

    Please review the information above to ensure everything is accurate. If there are any discrepancies or if you have any additional requests, please don't hesitate to contact us at ${process.env.FRONTEND_URL}.

    As part of our commitment to providing exceptional service, we offer a range of amenities and facilities to enhance your visit. Take advantage of our concierge services, we're here to make your experience memorable.

    Upon arrival, our friendly staff will be ready to assist you with the entry process and answer any questions you may have. We want to ensure your visit is seamless and enjoyable from start to finish.

    Thank you for choosing ${hotel?.name || restaurant?.name}. We look forward to welcoming you and making your stay with us unforgettable.

    Warm regards,

    Administrator,
    ${hotel?.name || restaurant?.name}
    ${hotel?.city || restaurant?.city}, ${hotel?.country || restaurant?.country}`;

    return emailContent;
}