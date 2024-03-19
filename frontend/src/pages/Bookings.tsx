import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import * as apiClient from "../api-client";

const Bookings = () => {
    const { bookingId } = useParams<{ bookingId?: string }>();
    const [searchData, setSearchData] = useState<string>(bookingId || "");
    const queryClient = useQueryClient();

    const { data: bookings, refetch } = useQuery("loadBookings", () => apiClient.loadBookings(searchData), {
        refetchOnWindowFocus: false
    });

    const handleClear = () => {
        setSearchData("");
    }

    const handleCancel = async (bookingId: string) => {
        if (confirm(`Are you sure you want to cancel booking (#bookingId:${bookingId})?`)) {
            await cancelBooking.mutateAsync(bookingId);
        }
    }

    const cancelBooking = useMutation<void, Error, string>(apiClient.cancelBooking, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadBookings");
        }
    });

    useEffect(() => {
        refetch();
    }, [searchData]);

    const sortedFilteredBookings = searchData.trim() ? bookings?.filter(booking => (booking._id === searchData || booking._id === searchData)) : bookings;

    return (
        <div className="container mx-auto">
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
                                <h2 className="text-lg font-semibold mb-2">{booking.categoryId.name}</h2>
                                {(booking.bookingStatus === "active") ? (<button className="text-lg font-bold mb-2 text-blue-800 hover:text-blue-600"
                                    onClick={() => { handleCancel(booking._id) }}>
                                    Cancel
                                </button>) : <>{booking.bookingStatus}</>}
                            </div>
                            <p>Booking ID: {booking._id}</p>
                            <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                            <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                            <p>Rooms Details: {booking.roomDetail}</p>
                            <p>Date of Booking: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                            <p>Total Cost: ₹{booking.totalCost}</p>
                            <div className="w-full h-[300px] mt-2">
                                <img src={booking.categoryId.imageUrls[0]} className="w-full h-full object-cover object-center" alt="Hotel" />
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