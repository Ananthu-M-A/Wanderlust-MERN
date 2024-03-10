import React, { useContext, useState } from "react";

type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    roomType: string;
    roomCount: number;
    roomPrice: number;
    totalCost: number;
    hotelId: string;
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        roomType: string,
        roomCount: number,
        roomPrice: number,
        totalCost: number) => void;
    clearSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        roomType: string,
        roomCount: number,
        roomPrice: number,
        totalCost: number) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
    children: React.ReactNode;
}

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
    const [destination, setDestination] = useState<string>(
        () => sessionStorage.getItem("destination") || ""
    );
    const [checkIn, setCheckIn] = useState<Date>(
        () => new Date(sessionStorage.getItem("checkIn") || new Date().toISOString()));
    const [checkOut, setCheckOut] = useState<Date>(
        () => new Date(sessionStorage.getItem("checkOut") || new Date().toISOString()));
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
        hotelId?: string) => {

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

    const clearSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        roomType: string,
        roomCount: number,
        roomPrice: number,
        totalCost: number,
        hotelId?: string) => {

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

        sessionStorage.setItem("destination", "");
        sessionStorage.setItem("checkIn", new Date().toISOString());
        sessionStorage.setItem("checkOut", new Date().toISOString());
        sessionStorage.setItem("adultCount", "1");
        sessionStorage.setItem("childCount", "0");
        sessionStorage.setItem("roomType", "");
        sessionStorage.setItem("roomCount", "1");
        sessionStorage.setItem("roomPrice", "0");
        sessionStorage.setItem("totalCost", "0");
        if (hotelId) {
            sessionStorage.setItem("hotelId", hotelId);
        }
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