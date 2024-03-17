import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import * as apiClient from "../api-client";

const Orders = () => {
    const { bookingId } = useParams<{ bookingId?: string }>();
    const [searchData, setSearchData] = useState<string>(bookingId || "");

    const { data: orders, refetch } = useQuery("loadOrders", () => apiClient.loadOrders(searchData), {
        refetchOnWindowFocus: false
    });

    const handleClear = () => {
        setSearchData("");
    }

    useEffect(() => {
        refetch();
    }, [searchData]);

    const sortedFilteredOrders = searchData.trim() ? orders?.filter(order => (order._id === searchData || order.hotelName === searchData)) : orders;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Booking Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 border">
                <div className="flex flex-row items-center flex-1 bg-white p-2 border rounded">
                    <input
                        placeholder="Search orders by booking ID..."
                        value={searchData}
                        className="text-md w-full focus:outline-none"
                        onChange={(event) => setSearchData(event.target.value)}
                    />
                    <button className="w-100 font-bold text-xl hover:text-blue-600 px-2">
                        Search
                    </button>
                    <button className="w-100 font-bold text-xl hover:text-blue-600 px-2" onClick={handleClear}>
                        Clear
                    </button>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    {(searchData === "") && <h6 className="ml-2">Showing latest bookings...</h6>}
                    {sortedFilteredOrders?.length ? sortedFilteredOrders.map((order: any) => (
                        <div key={order._id} className="bg-white rounded shadow p-4 hover:shadow-lg scroll">
                            <h2 className="text-lg font-semibold mb-2">{order.hotelName}</h2>
                            <p>Booking ID: {order._id}</p>
                            <p>Check-in: {new Date(order.checkIn).toLocaleDateString()}</p>
                            <p>Check-out: {new Date(order.checkOut).toLocaleDateString()}</p>
                            <p>Rooms Details: {order.roomDetail}</p>
                            <p>Booking Email: {order.bookingEmail}</p>
                            <p>Date of Booking: {new Date(order.bookingDate).toLocaleDateString()}</p>
                            <p>Total Cost: ₹{order.totalCost}</p>
                            <div className="w-full h-[300px] mt-2">
                                <img src={order.hotelImageUrl} className="w-full h-full object-cover object-center" alt="Hotel" />
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

export default Orders;