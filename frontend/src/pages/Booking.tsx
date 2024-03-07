import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
    const { stripePromise } = useAppContext();
    const search = useSearchContext();
    const { hotelId } = useParams();

    const [numberOfNights, setNumberOfNights] = useState<number>(0);
    const [roomCount, setRoomCount] = useState<number>(1);
    const [roomPrice, setRoomPrice] = useState<number>(1);

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.floor(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24);
            setNumberOfNights(nights < 1 ? 1 : nights);
        }
        setRoomPrice(search.roomPrice);
        setRoomCount(search.roomCount);
    }, [search.checkIn, search.checkOut])

    const { data: paymentIntentData } = useQuery("createPaymentIntent",
        () => apiClient.createPaymentIntent(
            hotelId as string,
            numberOfNights.toString(),
            roomPrice.toString(),
            roomCount.toString(),
        ),
        {
            enabled: !!hotelId && numberOfNights > 0
        }
    );

    const { data: hotel } = useQuery("loadHotelHomeById",
        () => apiClient.loadHotelHomeById(hotelId as string), {
        enabled: !!hotelId
    }
    );

    const { data: currentUser } = useQuery(
        "loadCurrentUser",
        apiClient.loadCurrentUser
    );

    if (!hotel) {
        return <></>
    }

    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailSummary
                checkIn={search.checkIn} checkOut={search.checkOut}
                adultCount={search.adultCount} childCount={search.childCount}
                roomType={search.roomType} roomPrice={search.roomPrice} roomCount={roomCount}
                numberOfNights={numberOfNights} hotel={hotel} />
            {currentUser && paymentIntentData && (
                <Elements stripe={stripePromise} options={{
                    clientSecret: paymentIntentData.clientSecret,
                }}>
                    <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
                </Elements>
            )}
        </div>
    );
}

export default Booking
