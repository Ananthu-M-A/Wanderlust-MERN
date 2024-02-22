export type UserType = {
    _id: string,
    email: string,
    mobile: string,
    password: string,
    firstName: string,
    lastName: string,
};

export type HotelType = {
    _id: string,
    userId: string,
    name: string,
    city: string,
    country: string,
    description: string,
    type: string,
    adultCount: number,
    childCount: number,
    facilities: string[],
    pricePerNight: number,
    starRating: number,
    imageUrls: string[],
    lastUpdated: Date,
};

export type SearchResponse = {
    data: HotelType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}
