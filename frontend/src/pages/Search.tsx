import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

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
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter selectedStars={selectedStars} onChange={handleStarChange} />
          <HotelTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleHotelTypeChange} />
          <FacilitiesFilter selectedFacilities={selectedFacilities} onChange={handleFacilityChange} />
          <PriceFilter selectedPrice={selectedPrice} onChange={(value?: number) => setSelectedPrice(value)} />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {(hotelData?.data.length !== 0) ?
          (<>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">
                {/* {hotelData?.data.length === 0 ? "0" : hotelData?.pagination.total} */}
                Hotels found
                {search.destination ? ` in ${search.destination}` : ""}
              </span>
              <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}
                className="p-2 border rounded-md">
                <option value="">Sort by</option>
                <option value="starRating">Star Rating</option>
                <option value="pricePerNightAsc">Price Per Night(low to high)</option>
                <option value="pricePerNightDesc">Price Per Night(high to low)</option>
              </select>
            </div>

            {hotelData?.data.map((hotel, index) => (
            <SearchResultsCard key={index} hotel={hotel} />
            ))}

            <Pagination
              page={hotelData?.pagination.page || 1}
              pages={hotelData?.pagination.pages || 1}
              onPageChange={(page) => setPage(page)} />
          </>)
          : (
            <div>
              <img src="https://img.freepik.com/free-vector/detective-following-footprints-concept-illustration_114360-21835.jpg?t=st=1709021064~exp=1709024664~hmac=b9ac18bf2f3e27574638c5fa9f59ad646fe7013ad348bcfe5df4ab62b2d9f38f&w=740" alt="" />
            </div>
          )}
      </div>
    </div>
  )
}

export default Search;
