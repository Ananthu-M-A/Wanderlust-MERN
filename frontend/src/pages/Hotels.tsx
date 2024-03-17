import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
import { useState } from "react";
import Pagination from "../components/Pagination";

const Hotels = () => {
    const [searchData, setSearchData] = useState("");
    const [page, setPage] = useState<number>(1);
    const queryClient = useQueryClient();    

    const searchParams = {
        destination: searchData,
        page: page.toString(),
    }

    const { data: hotelData } = useQuery(["loadHotels", searchParams],
        () => apiClient.loadHotels(searchParams));

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

    const handleClear = () => {
        setSearchData("");
    }

    return (
        <div className="space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">Hotels</h1>
                <Link to="/admin/add-hotel" className="flex bg-black text-blue-300 text-xl font-bold p-2 hover:text-white">
                    Add Hotel
                </Link>
            </span>

            <div className="overflow-x-auto">
                <div className="flex flex-row items-center flex-1 bg-white p-2 border rounded mb-2">
                    <input placeholder="Search hotels by name or place..." value={searchData}
                        className="text-md w-full focus:outline-none"
                        onChange={(event) => { setSearchData(event.target.value) }} />
                    <button className="w-100 font-bold text-xl hover:text-blue-600"
                        onClick={handleClear}>
                        Clear
                    </button>
                </div>
                <table className="table-auto w-full border-collapse border border-gray-800">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-800 px-4 py-2">Hotel Name</th>
                            <th className="border border-gray-800 px-4 py-2">Place</th>
                            <th className="border border-gray-800 px-4 py-2">Hotel ID</th>
                            <th className="border border-gray-800 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(hotelData && hotelData.data.length > 0) ? hotelData.data.map((hotel) => (
                            <tr key={hotel._id} className="bg-white">
                                <td className="border border-gray-800 px-4 py-2">{hotel.name}</td>
                                <td className="border border-gray-800 px-4 py-2">{`${hotel.city}, ${hotel.country}`}</td>
                                <td className="border border-gray-800 px-4 py-2">{hotel._id}</td>
                                <td className="border border-gray-800 px-4 py-2">
                                    <div className="flex justify-center">
                                        <span className="mr-4">
                                            <Link to={`/admin/edit-hotel/${hotel._id}`}
                                                className="flex text-black text-xl font-bold p-2">
                                                View
                                            </Link>
                                        </span>
                                        <span>
                                            {hotel.isBlocked ? (
                                                <button
                                                    onClick={() => handleUnblock(hotel._id)}
                                                    className="w-100 text-blue-600 h-full p-2 font-bold text-xl hover:text-red-600"
                                                >
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBlock(hotel._id)}
                                                    className="w-100 text-red-600 h-full p-2 font-bold text-xl hover:text-blue-600"
                                                >
                                                    Block
                                                </button>
                                            )}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <>
                                <span className="ml-2">Hotels list is empty</span>
                            </>
                        )}
                    </tbody>
                </table>
                <Pagination
                    page={hotelData?.pagination.page || 1}
                    pages={hotelData?.pagination.pages || 1}
                    onPageChange={(page) => setPage(page)} />
            </div>
        </div>
    )
}

export default Hotels;
