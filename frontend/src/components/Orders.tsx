import { useQuery } from "react-query";
import * as apiClient from "../api-client";


const Orders = () => {
    const { data: hotels } = useQuery("loadHotels", apiClient.loadHotels,
        {
            onError: () => { }
        }
    );
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Orders List</h1>
      <div className="grid grid-cols-1 gap-4">
        {hotels?.map((hotel) => (
          <div key={hotel._id} className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">{hotel.bookings[0]._id}</h2>
            <ul>
              {hotel.bookings.map((booking) => (
                <li key={booking._id} className="border-b py-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg">{hotel.bookings[0]._id} {hotel.bookings[0]._id}</p>
                      <p>{hotel.bookings[0]._id}</p>
                      <p>Check-in: {hotel.bookings[0]._id}</p>
                      <p>Check-out: {hotel.bookings[0]._id}</p>
                    </div>
                    <div>
                      <p>Total Cost: ${hotel.bookings[0]._id}</p>
                      <p>Adults: {hotel.bookings[0]._id}</p>
                      <p>Children: {hotel.bookings[0]._id}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
