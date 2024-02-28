import { FormEvent, useEffect, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleMap from "./GoogleMap";

const SearchBar = () => {
    const search = useSearchContext();
    const navigate = useNavigate();
    const [data, setData] = useState<string[]>([]);
    const [place, setPlace] = useState<string>();
    const { pathname } = useLocation();

    useEffect(() => {
        console.log("hotel names", data);
        console.log("place", place);
        if (pathname === "/") {
            navigate("/search");
        }
    }, [data, place, navigate])

    const [searchInput, setSearchInput] = useState('');
    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);

    const handleSearchInputChange = (value: string) => {
        setSearchInput(value);
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount);
        navigate("/search");
    };

    const handleClear = (event: FormEvent) => {
        event.preventDefault();
        search.clearSearchValues(destination, checkIn, checkOut, adultCount, childCount);
        navigate("/search");
        window.location.reload();
    };

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const handleData = (data: string[], place: string) => {
        setData(data);
        setPlace(place);
        const destination = place.split(", ");
        search.saveSearchValues(destination[0], checkIn, checkOut, adultCount, childCount);
    };

    return (
        <form onSubmit={handleSubmit}
            className="-mt-16 p-3 bg-black rounded shadow-md grid gid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4">
            <div>
                <DatePicker
                    selected={checkIn} selectsStart startDate={checkIn} endDate={checkOut}
                    minDate={minDate} maxDate={maxDate} placeholderText="Check-in Date"
                    onChange={(date) => { setCheckIn(date as Date); setCheckOut(date as Date); }}
                    wrapperClassName="min-w-full" className="min-w-full bg-white p-2 focus:outline-none"
                />
            </div>
            <div className="flex bg-white px-2 py-1 gap-2">
                <label className="items-center flex">
                    Adults:
                    <input type="number" min={1} max={20} value={adultCount}
                        className="w-full p-1 focus:outline-none font-bold"
                        onChange={(event) => setAdultCount(parseInt(event.target.value))} />
                </label>
                <label className="items-center flex">
                    Children:
                    <input type="number" min={0} max={20} value={childCount}
                        className="w-full p-1 focus:outline-none font-bold"
                        onChange={(event) => setChildCount(parseInt(event.target.value))} />
                </label>
            </div>
            <div>
                <DatePicker
                    selected={checkOut} startDate={checkIn} endDate={checkOut}
                    minDate={checkIn} maxDate={maxDate} placeholderText="Check-out Date"
                    onChange={(date) => setCheckOut(date as Date)}
                    wrapperClassName="min-w-full" className="min-w-full bg-white p-2 focus:outline-none"
                />
            </div>
            <button
                className="w-100 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500">
                Search
            </button>
            <div className="flex flex-row items-center flex-1 bg-white p-2">
                <MdTravelExplore size={25} className="mr-2" />
                <input placeholder="Where are you going?" value={destination}
                    className="text-md w-full focus:outline-none"
                    onChange={(event) => { setDestination(event.target.value) }} />
            </div>
            <button onClick={handleClear}
                className="w-100 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
                Reset
            </button>
            <GoogleMap searchInput={searchInput} onInputChange={handleSearchInputChange} sendDataToParent={handleData} />
        </form>
    )
}

export default SearchBar;