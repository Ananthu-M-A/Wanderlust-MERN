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

export type roomDetail = {
    roomType: string;
    roomPrice: number;
    roomCount: number;
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
    _id: string;
    userId: Object;
    categoryId: Object;
    hotelId: string;
    adultCount: number;
    childCount: number;
    checkIn: Date;
    checkOut: Date;
    roomDetails: {
        roomType: string;
        roomPrice: number;
        roomCount: number;
    };
    roomType: string;
    roomPrice: number;
    roomCount: number;
    nightsPerStay: number;
    totalCost: number;
    paymentId: string;
    bookingDate: Date;
    bookingStatus: string;
    page: string;
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

export type SearchBookingResponse = {
    data: BookingType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}

export type SearchUserResponse = {
    data: UserType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}