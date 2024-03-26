import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../../../api-client";
import ConfirmModal from "../../../components/ConfirmModal";

const Bookings = () => {
    const { bookingId } = useParams<{ bookingId?: string }>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [cancelId, setCancelId] = useState<string>(bookingId || "");
    const [searchData, setSearchData] = useState<string>(bookingId || "");
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: bookings, refetch } = useQuery("loadBookings", () => apiClient.loadBookings(searchData), {
        refetchOnWindowFocus: false,
        refetchInterval: 5000,
        enabled: !!searchData,
    });


    const handleClear = () => {
        setSearchData("");
    }

    const handleCancel = async (bookingId: string) => {
        setShowModal(true);
        setCancelId(bookingId);
    }

    const cancelBooking = useMutation<void, Error, string>(apiClient.cancelBooking, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadBookings");
            navigate("/home/bookings")
        }
    });

    useEffect(() => {
        refetch();
    }, [navigate]);

    const sortedFilteredBookings = searchData.trim() ? bookings?.filter(booking => (booking._id === searchData || booking._id === searchData)) : bookings;

    return (
        <div className="container mx-auto">
            <ConfirmModal isOpen={showModal} message={`Do you really wish to cancel this booking?`}
                onClose={function (): void { setShowModal(false); }}
                onConfirm={async function (): Promise<void> {
                    await cancelBooking.mutateAsync(cancelId);
                    setShowModal(false);
                }} />
            <h1 className="text-2xl font-bold mb-4">Bookings</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 border">
                <div className="flex flex-row items-center flex-1 bg-white p-2 border rounded">
                    <input
                        placeholder="Search bookings by booking ID..."
                        value={searchData}
                        className="text-md w-full focus:outline-none"
                        onChange={(event) => { setSearchData(event.target.value) }}
                    />
                    <button className="w-100 font-bold text-xl hover:text-blue-600 px-2" onClick={handleClear}>
                        Clear
                    </button>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    {(searchData === "") &&
                        <h6 className="ml-2">Showing latest bookings...</h6>}
                    {sortedFilteredBookings?.length ? sortedFilteredBookings.map((booking: any) => (
                        <div key={booking._id} className="bg-white rounded shadow p-4 hover:shadow-lg scroll">
                            <div className="flex justify-between">
                                {booking.hotelId && (<>
                                    <h2 className="text-lg font-semibold mb-2">{booking.hotelId.name}
                                        <h6 className="text-sm font-semibold text-gray-600">Hotel</h6>
                                    </h2>
                                </>)}
                                {booking.restaurantId && (<>
                                    <h2 className="text-lg font-semibold mb-2">{booking.restaurantId.name}
                                        <h6 className="text-sm font-semibold text-gray-600">Restaurant</h6>
                                    </h2>
                                </>)}
                                {(booking.bookingStatus === "active") ? (<button className="text-lg font-bold mb-2 text-blue-800 hover:text-blue-600"
                                    onClick={() => { handleCancel(booking._id) }}>
                                    Cancel
                                </button>) : <>{`${booking.bookingStatus} on ${booking.cancellationDate}`}</>}
                            </div>
                            <p>Booking ID: {booking._id}</p>
                            {booking.roomDetails && <>
                                <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                                <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                                <p>Rooms Details: {`${booking.roomDetails.roomType} Bed Rooms, ₹${booking.roomDetails.roomPrice}, ${booking.roomDetails.roomCount} Nos`}</p>
                            </>}
                            {booking.foodDetails && <>
                                <p>Booked Date: {booking.dateOfBooking}</p>
                                <p>Food Details: {`${booking.foodDetails.foodItem} of price ₹${booking.foodDetails.foodPrice} for ${booking.foodDetails.foodCount} guests`}</p>
                            </>}
                            <p>Date of Booking: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                            <p>Total Cost: ₹{booking.totalCost}</p>
                            <div className="w-full h-[300px] mt-2">
                                {booking.hotelId && <img src={booking.hotelId.imageUrls[0]} className="w-full h-full object-cover object-center" alt="Hotel" />}
                                {booking.restaurantId && <img src={booking.restaurantId.imageUrls[0]} className="w-full h-full object-cover object-center" alt="Restaurant" />}
                            </div>

                        </div>
                    )) : (
                        <div>
                            <h6 className="ml-2">{searchData.trim() ? 'Click on search button' : 'List is empty. Book hotels '}
                                <Link to="/search"> now</Link>.
                            </h6>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;