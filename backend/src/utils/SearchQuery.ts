import { BookingBotSearchParams, HotelSearchParams, UserSearchParams } from "../../../types/types";

export const constructSearchHotelQuery = (queryParams: HotelSearchParams) => {
    let searchQuery: any = {};

    if (queryParams.destination) {
        searchQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
            { name: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        searchQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount)
        };
    }

    if (queryParams.childCount) {
        searchQuery.childCount = {
            $gte: parseInt(queryParams.childCount)
        };
    }

    if (queryParams.facilities) {
        searchQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities]
        };
    }

    if (queryParams.types) {
        searchQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types]
        }
    }

    if (queryParams.stars) {
        searchQuery.starRating = {
            $in: Array.isArray(queryParams.stars)
                ? queryParams.stars
                : [queryParams.stars]
        }
    }

    if (queryParams.maxPrice) {
        searchQuery['roomTypes.price'] = {
            $lte: parseInt(queryParams.maxPrice)
        };
    }

    return searchQuery;
};

export const bookingBotSearchQuery = (queryParams: BookingBotSearchParams) => {
    let constructedQuery: any = {};
    if (queryParams.destination) {
        constructedQuery.$or = [
            { name: new RegExp(queryParams.destination, "i") },
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }
    return constructedQuery
};

export const constructSearchQuery = (queryParams: UserSearchParams) => {
    let constructedQuery: any = {};
    if (queryParams.destination) {
        constructedQuery.$or = [
            { name: new RegExp(queryParams.destination, "i") },
            { email: new RegExp(queryParams.destination, "i") },
            { mobile: new RegExp(queryParams.destination, "i") },
        ];
    }
    return constructedQuery
}