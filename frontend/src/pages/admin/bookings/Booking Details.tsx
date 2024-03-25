import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import * as apiClient from "../../../api-client";


const BookingDetails = () => {
    const { bookingId } = useParams();
    const { data: bookingDetails } = useQuery("loadBookingDetails",
        () => apiClient.loadBookingDetails(bookingId as string));
    return (
        <div className="container mx-auto">
            <div className="mt-8">
                <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
                {bookingDetails && (
                    <div key={bookingDetails._id} className="bg-white rounded shadow p-4 hover:shadow-lg scroll">
                        <div className="flex justify-between">
                            <h2 className="text-lg font-semibold mb-2">{bookingDetails.categoryId?.name}</h2>
                            {<>{bookingDetails.bookingStatus}</>}
                        </div>
                        <p>Booking ID: {bookingDetails._id}</p>
                        <p>Check-in: {new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
                        <p>Check-out: {new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
                        <p>Rooms Details: {`${bookingDetails.roomDetails.roomType} Bed Rooms, ₹${bookingDetails.roomDetails.roomPrice}, ${bookingDetails.roomDetails.roomCount} Nos`}</p>
                        <p>Date of Booking: {new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
                        <p>Total Cost: ₹{bookingDetails.totalCost}</p>
                        <div className="w-full h-[300px] mt-2">
                            <img src={bookingDetails.categoryId?.imageUrls[0]} className="w-full h-full object-cover object-center" alt="Hotel" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetails;
