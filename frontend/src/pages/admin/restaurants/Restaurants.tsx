import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from '../../../api-client';
import { useEffect, useState } from "react";
import Pagination from "../../../components/search/filters/Pagination";
import ConfirmModal from "../../../components/ConfirmModal";

const Restaurants = () => {
    const [searchData, setSearchData] = useState("");
    const [page, setPage] = useState<number>(1);
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [restaurantId, setRestaurantId] = useState("");
    const [blockStatus, setBlockStatus] = useState(false);

    const searchParams = {
        destination: searchData,
        page: page.toString(),
    }

    const { data: restaurantData, refetch } = useQuery(["loadRestaurants", searchParams],
        () => apiClient.loadRestaurants(searchParams), {
        refetchOnWindowFocus: false,
        refetchInterval: 5000,
        enabled: !!searchData
    });

    const blockRestaurant = useMutation<void, Error, string>(apiClient.blockRestaurant, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadRestaurants");
        }
    });

    const unblockRestaurant = useMutation<void, Error, string>(apiClient.unblockRestaurant, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadRestaurants");
        }
    });

    const handleBlock = async (restaurantId: string) => {
        setRestaurantId(restaurantId);
        setBlockStatus(false);
        setShowModal(true);
    };

    const handleUnblock = async (restaurantId: string) => {
        setRestaurantId(restaurantId);
        setBlockStatus(true);
        setShowModal(true);
    };

    const handleClear = () => {
        setSearchData("");
    }

    useEffect(() => {
        refetch();
    }, []);

    return (
        <div className="space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">Restaurants</h1>
                <Link to="/admin/add-restaurant" className="flex bg-black text-blue-300 text-xl font-bold p-2 hover:text-white">
                    Add Restaurant
                </Link>
            </span>
            <ConfirmModal isOpen={showModal} message={`Do you really wish to ${blockStatus ? "Unblock" : "Block"} ${restaurantId}`}
                onClose={function (): void {
                    setShowModal(false);
                }} onConfirm={async function (): Promise<void> {
                    setShowModal(false);
                    if (blockStatus) { await unblockRestaurant.mutateAsync(restaurantId); }
                    else { await blockRestaurant.mutateAsync(restaurantId); }
                }} />
            <div className="overflow-x-auto">
                <div className="flex flex-row items-center flex-1 bg-white p-2 border rounded mb-2">
                    <input placeholder="Search restaurants by name or place..." value={searchData}
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
                            <th className="border border-gray-800 px-4 py-2">Restaurant Name</th>
                            <th className="border border-gray-800 px-4 py-2">Place</th>
                            <th className="border border-gray-800 px-4 py-2">Hotel ID</th>
                            <th className="border border-gray-800 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(restaurantData && restaurantData.data.length > 0) ? restaurantData.data.map((restaurant) => (
                            <tr key={restaurant._id} className="bg-white">
                                <td className="border border-gray-800 px-4 py-2">{restaurant.name}</td>
                                <td className="border border-gray-800 px-4 py-2">{`${restaurant.city}, ${restaurant.country}`}</td>
                                <td className="border border-gray-800 px-4 py-2">{restaurant._id}</td>
                                <td className="border border-gray-800 px-4 py-2">
                                    <div className="flex justify-center">
                                        <span className="mr-4">
                                            <Link to={`/admin/edit-restaurant/${restaurant._id}`}
                                                className="flex text-black text-xl font-bold p-2">
                                                View
                                            </Link>
                                        </span>
                                        <span>
                                            {restaurant.isBlocked ? (
                                                <button
                                                    onClick={() => handleUnblock(restaurant._id)}
                                                    className="w-100 text-blue-600 h-full p-2 font-bold text-xl hover:text-red-600"
                                                >
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBlock(restaurant._id)}
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
                                <span className="ml-2">List empty</span>
                            </>
                        )}
                    </tbody>
                </table>
                <Pagination
                    page={restaurantData?.pagination.page || 1}
                    pages={restaurantData?.pagination.pages || 1}
                    onPageChange={(page) => setPage(page)} />
            </div>
        </div>
    )
}

export default Restaurants;

