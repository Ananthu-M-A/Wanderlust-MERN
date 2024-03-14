import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
import { BsMap } from "react-icons/bs";
import { BiFoodMenu, BiMoney, BiStar } from "react-icons/bi";

const Restaurants = () => {
    const queryClient = useQueryClient();
    const { data: restaurantData } = useQuery("loadRestaurants", apiClient.loadRestaurants,
        {
            onSuccess: () => { },
            onError: () => { }
        }
    );

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
        await blockRestaurant.mutateAsync(restaurantId);
    };

    const handleUnblock = async (restaurantId: string) => {
        await unblockRestaurant.mutateAsync(restaurantId);
    };

    return (
        <div className="space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">Restaurants</h1>
                <Link to="/admin/add-restaurant" className="flex bg-black text-blue-300 text-xl font-bold p-2 hover:text-white">
                    Add Restaurant
                </Link>
            </span>
            <div className="grid grid-cols-1 gap-8">
                {(restaurantData && restaurantData.length > 0) ? restaurantData.map((restaurant, index) => (
                    <div key={index} className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
                        <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                        <div className="whitespace-pre-line">{restaurant.description}</div>
                        <div className="grid grid-cols-5 gap-2">
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BsMap className="mr-1" />
                                {restaurant.city}, {restaurant.country}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiFoodMenu className="mr-1" />
                                {restaurant.type}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiMoney className="mr-1" />
                                ₹{restaurant.foodItems[0].price} per item
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiFoodMenu className="mr-1" />
                                {restaurant.foodItems[0].item}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiStar className="mr-1" />
                                {restaurant.starRating} Star Rating
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <span className="mr-4">
                                <Link to={`/admin/edit-restaurant/${restaurant._id}`}
                                    className="flex bg-black text-blue-300 text-xl font-bold p-2 hover:text-white">
                                    Details
                                </Link>
                            </span>
                            <span>
                                {restaurant.isBlocked ? (
                                    <button
                                        onClick={() => handleUnblock(restaurant._id)}
                                        className="w-100 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500"
                                    >
                                        Unblock
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleBlock(restaurant._id)}
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
                        <span className="">Restaurants list is empty</span>
                        <div className="w-80 mx-auto flex items-center justify-center">
                            <img src="https://img.freepik.com/free-vector/detective-following-footprints-concept-illustration_114360-21835.jpg?t=st=1709021064~exp=1709024664~hmac=b9ac18bf2f3e27574638c5fa9f59ad646fe7013ad348bcfe5df4ab62b2d9f38f&w=740" alt="" />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Restaurants;
