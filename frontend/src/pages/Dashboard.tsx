import { useQuery } from 'react-query';
import * as apiClient from "../api-client";
import { useEffect } from 'react';

const Dashboard = () => {
    const { data: bookings } = useQuery("loadOrders", apiClient.loadOrdersTable,
        {
            onSuccess: () => { },
            onError: () => { },
        }
    );
    useEffect(() => {

    }, []);
    const totalBookings = bookings?.length;
    const totalCost = bookings?.reduce((total, booking) => total + booking.totalCost, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
                    <p className="text-3xl font-bold">{totalBookings}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
                    <p className="text-3xl font-bold">₹{totalCost?.toFixed(2)}</p>
                </div>
            </div>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-800">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-800 px-4 py-2">Booking ID</th>
                            <th className="border border-gray-800 px-4 py-2">Hotel Name</th>
                            <th className="border border-gray-800 px-4 py-2">Check-in</th>
                            <th className="border border-gray-800 px-4 py-2">Check-out</th>
                            <th className="border border-gray-800 px-4 py-2">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings?.slice(0, 5).map(booking => (
                            <tr key={booking._id} className="bg-white">
                                <td className="border border-gray-800 px-4 py-2">{booking._id}</td>
                                <td className="border border-gray-800 px-4 py-2">{booking.hotelName}</td>
                                <td className="border border-gray-800 px-4 py-2">{(new Date(booking.checkIn)).toDateString()}</td>
                                <td className="border border-gray-800 px-4 py-2">{(new Date(booking.checkOut)).toDateString()}</td>
                                <td className="border border-gray-800 px-4 py-2">${booking.totalCost.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
