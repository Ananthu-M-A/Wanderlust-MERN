import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../../types/types";
import { Link } from "react-router-dom";

type Props = {
    hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
    return (
        <div className="grid grid-cols-2 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8 bg-gray-100  hover:bg-blue-100">
            <div className="w-full h-[300px]">
                <img src={hotel.imageUrls[0]} className="w-full h-full object-cover object-center" />
            </div>
            <div className="grid grid-rows-[1fr_2fr_1fr]">
                <div>
                    <div className="flex items-center">
                        <span className="flex">
                            {Array.from({ length: hotel.starRating }).map((_, index) => (
                                <AiFillStar key={index} className="fill-yellow-400" />
                            ))}
                        </span>
                        <span className="ml-1 text-sm">
                            {hotel.type}
                        </span>
                    </div>
                    <Link to={`/detail/${hotel._id}`} className="text-2xl font-bold cursor-pointer">
                        {hotel.name}
                    </Link>
                </div>

                <div>
                    <div className="line-clamp-4">
                        {hotel.description}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-end whitespace-nowrap">
                    <div className="flex gap-1 items-center">
                        {hotel.facilities.slice(0, 3).map((facility, index) => (
                            <span key={index} className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                                {facility}
                            </span>
                        ))}
                        <span className="text-sm">
                            {hotel.facilities.length > 3 && `+${hotel.facilities.length - 3} more`}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-bold">
                            ₹{hotel.roomTypes[0] ? hotel.roomTypes[0].price : 0} per night
                        </span>
                        <Link to={`/detail/${hotel._id}`} className="mx-auto px-10 mr-0 rounded-md bg-blue-400 text-xl font-semibold text-white flex items-center p-2 hover:bg-blue-500">
                            View more
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchResultsCard;
