import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link } from "react-router-dom";

const Orders = () => {
    const { data: orders } = useQuery("loadOrders", apiClient.loadOrders,
        {
            onSuccess: () => { },
            onError: () => { }
        }
    );

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Booking Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                {(orders?.length > 0) ?
                    (orders?.map((order: any) => (
                        <div key={order._id} className="bg-white rounded shadow p-4 hover:shadow-lg">
                            <h2 className="text-lg font-semibold mb-2">{order.hotelName}</h2>
                            <p>Booking ID: {order._id}</p>
                            <p>Check-in: {new Date(order.checkIn).toLocaleDateString()}</p>
                            <p>Check-out: {new Date(order.checkOut).toLocaleDateString()}</p>
                            <p>Rooms Details: {order.roomDetail}</p>
                            <p>Booking Email: {order.bookingEmail}</p>
                            <p>Date of Booking: {new Date(order.bookingDate).toLocaleDateString()}</p>
                            <p>Total Cost: ₹{order.totalCost}</p>
                            <div className="w-full h-[300px] mt-2">
                                <img src={order.hotelImageUrl} className="w-full h-full object-cover object-center" />
                            </div>
                        </div>
                    ))) :
                    (<div>
                        <h6>List is empty. Book hotels <Link to="/search">now</Link>.</h6>
                    </div>)}
            </div>
        </div>
    );
};

export default Orders;
