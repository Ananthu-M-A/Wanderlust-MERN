import React, { useContext, useState } from "react";
import type { SearchContext } from "../../../types/types";
const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
    children: React.ReactNode;
}

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
    const [destination, setDestination] = useState<string>(
        () => sessionStorage.getItem("destination") || ""
    );
    const [checkIn, setCheckIn] = useState<Date>(
        () => {
            const storedCheckIn = sessionStorage.getItem("checkIn");
            let tomorrow = new Date();
            if (storedCheckIn) {
                tomorrow = new Date(storedCheckIn);
            }
            tomorrow.setDate(tomorrow.getDate() + 1);
            return storedCheckIn ? new Date(storedCheckIn) : tomorrow;
        }
    );
    const [checkOut, setCheckOut] = useState<Date>(
        () => {
            const storedCheckOut = sessionStorage.getItem("checkOut");
            const nextDay = new Date(checkIn);
            nextDay.setDate(nextDay.getDate() + 1);
            return storedCheckOut ? new Date(storedCheckOut) : nextDay;
        }
    );

    const [adultCount, setAdultCount] = useState<number>(
        () => parseInt(sessionStorage.getItem("adultCount") || "1")
    );
    const [childCount, setChildCount] = useState<number>(
        () => parseInt(sessionStorage.getItem("childCount") || "0")
    );
    const [roomType, setRoomType] = useState<string>(
        () => sessionStorage.getItem("roomType") || ""
    );
    const [roomCount, setRoomCount] = useState<number>(
        () => parseInt(sessionStorage.getItem("roomCount") || "1")
    );
    const [roomPrice, setRoomPrice] = useState<number>(
        () => parseInt(sessionStorage.getItem("roomPrice") || "0")
    );
    const [totalCost, setTotalCost] = useState<number>(
        () => parseInt(sessionStorage.getItem("totalCost") || "0")
    );
    const [hotelId, setHotelId] = useState<string>(
        () => sessionStorage.getItem("hotelId") || ""
    );

    const saveSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        roomType: string,
        roomCount: number,
        roomPrice: number,
        totalCost: number,
        hotelId?: string
    ) => {
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setAdultCount(adultCount);
        setChildCount(childCount);
        setRoomType(roomType);
        setRoomCount(roomCount);
        setRoomPrice(roomPrice);
        setTotalCost(totalCost);
        if (hotelId) {
            setHotelId(hotelId);
        }

        sessionStorage.setItem("destination", destination);
        sessionStorage.setItem("checkIn", checkIn.toISOString());
        sessionStorage.setItem("checkOut", checkOut.toISOString());
        sessionStorage.setItem("adultCount", adultCount.toString());
        sessionStorage.setItem("childCount", childCount.toString());
        sessionStorage.setItem("roomType", roomType);
        sessionStorage.setItem("roomCount", roomCount.toString());
        sessionStorage.setItem("roomPrice", roomPrice.toString());
        sessionStorage.setItem("totalCost", totalCost.toString());
        if (hotelId) {
            sessionStorage.setItem("hotelId", hotelId);
        }
    };

    const clearSearchValues = () => {
        setDestination("");
        setCheckIn(new Date());
        setCheckOut(new Date());
        setAdultCount(1);
        setChildCount(0);
        setRoomType("");
        setRoomCount(1);
        setRoomPrice(0);
        setTotalCost(0);
        setHotelId("");

        sessionStorage.removeItem("destination");
        sessionStorage.removeItem("checkIn");
        sessionStorage.removeItem("checkOut");
        sessionStorage.removeItem("adultCount");
        sessionStorage.removeItem("childCount");
        sessionStorage.removeItem("roomType");
        sessionStorage.removeItem("roomCount");
        sessionStorage.removeItem("roomPrice");
        sessionStorage.removeItem("totalCost");
        sessionStorage.removeItem("hotelId");
    };

    return (
        <SearchContext.Provider value={{
            destination, checkIn, checkOut, adultCount, childCount, roomType, roomCount, roomPrice, totalCost,
            hotelId, saveSearchValues, clearSearchValues
        }}>{children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext;
}
