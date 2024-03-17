export type RoomType = {
    type: string;
    price: number;
    quantity: number;
};

export type FoodItem = {
    item: string;
    price: number;
    availability: string;
};

export type OpeningHour = {
    day: string;
    startTime: string;
    endTime: string;
}

export type UserType = {
    _id: string,
    email: string,
    mobile: string,
    password: string,
    firstName: string,
    lastName: string,
    isBlocked: boolean,
    imageFile: FileList | null,
    imageUrl: string,
    role: string[],
};

export type HotelType = {
    _id: string,
    name: string,
    city: string,
    country: string,
    description: string,
    roomTypes: RoomType[],
    type: string,
    adultCount: number,
    childCount: number,
    facilities: string[],
    starRating: number,
    imageUrls: string[],
    lastUpdated: Date,
    bookings: BookingType[];
    isBlocked: boolean,
};

export type RestaurantType = {
    _id: string,
    name: string,
    city: string,
    country: string,
    description: string,
    foodItems: FoodItem[],
    type: string,
    openingHours: OpeningHour[],
    facilities: string[],
    starRating: number,
    imageUrls: string[],
    lastUpdated: Date,
    bookings: BookingType[],
    isBlocked: boolean,
};

export type BookingType = {
    hotelId(hotelId: any): unknown;
    roomType: any;
    roomPrice: any;
    roomCount: any;
    nightsPerStay: any;
    _id: string;
    userId: string;
    bookingEmail: string;
    hotelName: string;
    hotelImageUrl: string;
    adultCount: number;
    childCount: number;
    checkIn: Date;
    checkOut: Date;
    roomDetail: string;
    totalCost: number;
    bookingDate: Date;
    paymentId: string
};

export type SearchHotelResponse = {
    data: HotelType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}

export type SearchRestaurantResponse = {
    data: RestaurantType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}