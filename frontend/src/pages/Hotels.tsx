import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const Hotels = () => {
    const queryClient = useQueryClient();
    const { data: hotelData } = useQuery("loadHotels", apiClient.loadHotels,
        {
            onError: () => { }
        }
    );

    const blockHotel = useMutation<void, Error, string>(apiClient.blockHotel, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadHotels");
        }
    });

    const unblockHotel = useMutation<void, Error, string>(apiClient.unblockHotel, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadHotels");
        }
    });

    const handleBlock = async (hotelId: string) => {
        await blockHotel.mutateAsync(hotelId);
    };

    const handleUnblock = async (hotelId: string) => {
        await unblockHotel.mutateAsync(hotelId);
    };

    return (
        <div className="space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">Hotels</h1>
                <Link to="/admin/add-hotel" className="flex bg-black text-blue-300 text-xl font-bold p-2 hover:text-white">
                    Add Hotel
                </Link>
            </span>
            <div className="grid grid-cols-1 gap-8">
                {(hotelData && hotelData.length > 0) ? hotelData.map((hotel, index) => (
                    <div key={index} className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
                        <h2 className="text-2xl font-bold">{hotel.name}</h2>
                        <div className="whitespace-pre-line">{hotel.description}</div>
                        <div className="grid grid-cols-5 gap-2">
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BsMap className="mr-1" />
                                {hotel.city}, {hotel.country}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BsBuilding className="mr-1" />
                                {hotel.type}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiMoney className="mr-1" />
                                ₹{hotel.roomTypes[0].price} per night
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiHotel className="mr-1" />
                                {hotel.adultCount} adults, {hotel.childCount} children
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiStar className="mr-1" />
                                {hotel.starRating} Star Rating
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <span className="mr-4">
                                <Link to={`/admin/edit-hotel/${hotel._id}`}
                                    className="flex bg-black text-blue-300 text-xl font-bold p-2 hover:text-white">
                                    Details
                                </Link>
                            </span>
                            <span>
                                {hotel.isBlocked ? (
                                    <button
                                        onClick={() => handleUnblock(hotel._id)}
                                        className="w-100 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500"
                                    >
                                        Unblock
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleBlock(hotel._id)}
                                        className="w-100 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500"
                                    >
                                        Block
                                    </button>
                                )}
                            </span>
                        </div>
                    </div>
                )) : (
                    <>
                        <span className="">Hotels list is empty</span>
                        <div className="w-80 mx-auto flex items-center justify-center">
                            <img src="https://img.freepik.com/free-vector/detective-following-footprints-concept-illustration_114360-21835.jpg?t=st=1709021064~exp=1709024664~hmac=b9ac18bf2f3e27574638c5fa9f59ad646fe7013ad348bcfe5df4ab62b2d9f38f&w=740" alt="" />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Hotels;
