import { useQuery } from "react-query";
import { useSearchContext } from "../../../contexts/SearchContext";
import * as apiClient from "../../../api-client";
import { useState } from "react";
import SearchResultsCard from "../../../components/search/SearchResultsCard";
import Pagination from "../../../components/search/filters/Pagination";
import StarRatingFilter from "../../../components/search/filters/StarRatingFilter";
import HotelTypesFilter from "../../../components/search/filters/HotelTypesFilter";
import FacilitiesFilter from "../../../components/search/filters/FacilitiesFilter";
import PriceFilter from "../../../components/search/filters/PriceFilter";
import MyChatBot from "../../../components/chatbot/MyChatBot";
import "react-chatbotify/dist/react-chatbotify.css";
import { useAppContext } from "../../../contexts/AppContext";


const Search = () => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption
  }

  const { data: hotelData } = useQuery(["searchHotels", searchParams],
    () => apiClient.searchHotels(searchParams));

  const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) => (event.target.checked
      ? [...prevStars, starRating]
      : prevStars.filter((star) => star !== starRating)));
  }

  const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevHotelTypes) => (event.target.checked
      ? [...prevHotelTypes, hotelType]
      : prevHotelTypes.filter((type) => type !== hotelType)));
  }

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;

    setSelectedFacilities((prevFacilities) => (event.target.checked
      ? [...prevFacilities, facility]
      : prevFacilities.filter((prevFacility) => prevFacility !== facility)));
  }

  return (
    <div className="flex flex-col">
      <div className="rounded-lg border border-slate-300 h-fit sticky w-full bg-gray-100 opacity-80 top-0 p-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start">
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex justify-start items-center">
              <h3 className="text-sm font-semibold border-b">
                Filter by
              </h3>
              <button className="w-3 h-6 ml-2" onClick={() => { setShowFilter(!showFilter) }}>
                <img src="drop-down-arrow.png" alt="Toggle filter visibility" />
              </button>
            </div>
            {showFilter && (
              <div className="flex flex-col gap-4">
                <StarRatingFilter selectedStars={selectedStars} onChange={handleStarChange} />
                <HotelTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleHotelTypeChange} />
                <FacilitiesFilter selectedFacilities={selectedFacilities} onChange={handleFacilityChange} />
                <PriceFilter selectedPrice={selectedPrice} onChange={(value?: number) => setSelectedPrice(value)} />
              </div>
            )}
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <h3 className="text-sm font-semibold border-b mr-2">
              Sort by
            </h3>
            <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}
              className="border rounded-md">
              <option value="">Sort by</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">Price Per Night (low to high)</option>
              <option value="pricePerNightDesc">Price Per Night (high to low)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-3">
        {(hotelData?.data.length !== 0) ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">
                {hotelData && `${hotelData?.pagination.total} hotels found`}
                {search.destination ? ` in ${search.destination}` : ""}
              </span>
            </div>

            {isLoggedIn && (
              <div className="flex justify-center items-center mt-4">
                <MyChatBot />
              </div>
            )}

            {hotelData?.data.map((hotel, index) => (
              <SearchResultsCard key={index} hotel={hotel} />
            ))}

            <Pagination
              page={hotelData?.pagination.page || 1}
              pages={hotelData?.pagination.pages || 1}
              onPageChange={(page) => setPage(page)} />
          </>
        ) : (
          <div className="text-center mt-5">
            <strong>Result limit exceeded or No results found! Click reset button!</strong>
            <div className="mt-4">
              <img src="https://img.freepik.com/free-vector/detective-following-footprints-concept-illustration_114360-21835.jpg?t=st=1709021064~exp=1709024664~hmac=b9ac18bf2f3e27574638c5fa9f59ad646fe7013ad348bcfe5df4ab62b2d9f38f&w=740" alt="No results" className="mx-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search;
