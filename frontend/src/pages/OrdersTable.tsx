import { useQuery } from 'react-query';
import * as apiClient from "../api-client";
import { useEffect, useState } from 'react';

const OrdersTable = () => {
    const [searchData, setSearchData] = useState<string>("");
    useEffect(() => {

    }, []);
    const { data: bookings, refetch } = useQuery("loadOrders", apiClient.loadOrdersTable,
        {
            onSuccess: () => { },
            onError: () => { },
            refetchOnWindowFocus: false
        }
    );

    const handleClick = () => {
        refetch();
    }

    const filteredBookings = searchData.trim() ? bookings?.filter(booking => ((booking._id === searchData) || (booking.hotelName === searchData))) : bookings;
    const sortedFilteredBookings = [...(filteredBookings || [])].sort((b, a) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-row items-center flex-1 bg-white p-2 border rounded mb-2">
                <input placeholder="Search orders by booking ID..." value={searchData}
                    className="text-md w-full focus:outline-none"
                    onChange={(event) => { setSearchData(event.target.value) }} />
                <button className="w-100 font-bold text-xl hover:text-blue-600"
                    onClick={handleClick}>
                    Search
                </button>
            </div>
            <table className="table-auto w-full border-collapse border border-gray-800">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-800 px-4 py-2">Booking ID</th>
                        <th className="border border-gray-800 px-4 py-2">Hotel Name</th>
                        <th className="border border-gray-800 px-4 py-2">Check-in</th>
                        <th className="border border-gray-800 px-4 py-2">Check-out</th>
                        <th className="border border-gray-800 px-4 py-2">Adults</th>
                        <th className="border border-gray-800 px-4 py-2">Children</th>
                        <th className="border border-gray-800 px-4 py-2">Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFilteredBookings?.map(booking => (
                        <tr key={booking._id} className="bg-white">
                            <td className="border border-gray-800 px-4 py-2">{booking._id}</td>
                            <td className="border border-gray-800 px-4 py-2">{booking.hotelName}</td>
                            <td className="border border-gray-800 px-4 py-2">{(new Date(booking.checkIn)).toDateString()}</td>
                            <td className="border border-gray-800 px-4 py-2">{(new Date(booking.checkOut)).toDateString()}</td>
                            <td className="border border-gray-800 px-4 py-2">{booking.adultCount}</td>
                            <td className="border border-gray-800 px-4 py-2">{booking.childCount}</td>
                            <td className="border border-gray-800 px-4 py-2">{booking.totalCost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;
