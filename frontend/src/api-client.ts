import { LoginFormData } from "./pages/user/auth/Login";
import { RegisterFormData } from "./pages/user/auth/Register";
import { BookingType, HotelType, RestaurantType, SearchBookingResponse, SearchHotelResponse, SearchRestaurantResponse, SearchUserResponse, UserType } from '../../types/types';
import { loadStripe } from "@stripe/stripe-js";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const stripe = await loadStripe('pk_test_51OmXsJSFKXnVvS5mYKhovpdQ83qlQfCzxP9QRnOGMkwo60n8zQFqLa8fzfpaUVuaqmouwCH8NOcokyONxwPQUmHx00xxk61lmd');


export const loadCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/load-user`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error loading user");
    }
    return response.json();
}


export const loadAccount = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error loading user");
    }
    return response.json();
}


export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();
    localStorage.setItem("otpToken", responseBody.otpToken);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}


export const updateProfile = async (formData: FormData) => {
    console.log(formData);

    const response = await fetch(`${API_BASE_URL}/api/user/profile/update`, {
        method: 'PUT',
        credentials: "include",
        body: formData
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}



export const verifyRegistration = async (otp: string) => {
    const response = await fetch(`${API_BASE_URL}/api/user/verifyRegistration`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ otp }),
        credentials: 'include'
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}


export const login = async (formData: LoginFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}


export const validateAdminToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/validate-token`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Invalid Token");
    }

    return response.json();
}

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error during Logout");
    }
};


export const adminLogout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error during Logout");
    }
};


export const addHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/hotels/create-hotel`, {
        method: 'POST',
        credentials: "include",
        body: hotelFormData,
    });

    if (!response.ok) {
        throw new Error("Failed to add Hotel");
    }

    return response.json();
};

export const addRestaurant = async (restaurantFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/restaurants/create-restaurant`, {
        method: 'POST',
        credentials: "include",
        body: restaurantFormData,
    });

    if (!response.ok) {
        throw new Error("Failed to add Restaurant");
    }

    return response.json();
};


export const loadHotels = async (searchParams: SearchParams): Promise<SearchHotelResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("page", searchParams.page || "");
    const response = await fetch(`${API_BASE_URL}/api/admin/hotels?${queryParams}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to load hotels");
    }

    return response.json();
};

export const loadRestaurants = async (searchParams: SearchParams): Promise<SearchRestaurantResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("page", searchParams.page || "");
    const response = await fetch(`${API_BASE_URL}/api/admin/restaurants?z${queryParams}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to load restaurants");
    }

    return response.json();
};

export const blockHotel = async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/hotels/${hotelId}/block`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to block hotel");
    }
};


export const unblockHotel = async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/hotels/${hotelId}/unblock`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to unblock hotel");
    }
};

export const blockRestaurant = async (restaurantId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/restaurants/${restaurantId}/block`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to block restaurant");
    }
};


export const unblockRestaurant = async (restaurantId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/restaurants/${restaurantId}/unblock`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to unblock restaurant");
    }
};

export const loadHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/hotels/${hotelId}`, {
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to load hotel");
    }
    return response.json();
}

export const loadRestaurantById = async (restaurantId: string): Promise<RestaurantType> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/restaurants/${restaurantId}`, {
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to load restaurant");
    }
    return response.json();
}


export const updateHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/hotels/${hotelFormData.get("hotelId")}/update`, {
        method: "PUT",
        body: hotelFormData,
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to update hotel");
    }
    return response.json();
}

export const updateRestaurantById = async (restaurantFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/restaurants/${restaurantFormData.get("restaurantId")}/update`, {
        method: "PUT",
        body: restaurantFormData,
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to update restaurant");
    }
    return response.json();
}


export const loadUsers = async (searchParams: SearchParams): Promise<SearchUserResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("page", searchParams.page || "");
    const response = await fetch(`${API_BASE_URL}/api/admin/users?${queryParams}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to load hotels");
    }

    return response.json();
};


export const blockUser = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/block`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to block user");
    }
};


export const unblockUser = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/unblock`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to unblock user");
    }
};


export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
}

export const searchHotels = async (searchParams: SearchParams): Promise<SearchHotelResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");
    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) => queryParams.append("facilities", facility));
    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(`${API_BASE_URL}/api/user/home/search-hotels?${queryParams}`);
    if (!response.ok) {
        throw new Error("Error searching hotels");
    }
    return response.json();
}

export type SearchRestaurantParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
}

export const searchRestaurants = async (searchParams: SearchRestaurantParams): Promise<SearchRestaurantResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");
    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) => queryParams.append("facilities", facility));
    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(`${API_BASE_URL}/api/user/home/search-restaurants?${queryParams}`);
    if (!response.ok) {
        throw new Error("Error searching hotels");
    }
    return response.json();
}


export const loadHotelHomeById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/user/home/search-hotels/${hotelId}`);
    if (!response.ok) {
        throw new Error("Failed to update hotels");
    }
    return response.json();
}


export const createCheckoutSession = async (paymentData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/user/booking/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(paymentData)
    })
    if (!response.ok) {
        throw new Error("Error booking room");
    }
    const session = await response.json();
    const result = stripe?.redirectToCheckout({
        sessionId: session.id
    })
    console.log(result);
}

export const loadBookings = async (query: string): Promise<BookingType[]> => {
    try {
        console.log(query);
        
        const response = await fetch(`${API_BASE_URL}/api/user/booking/bookings?bookingId=${query}`, {
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Failed to load bookings");
        }
        return response.json();
    } catch (error) {
        console.error("Error loading bookings:", error);
        throw new Error("Failed to load bookings");
    }
}

export const cancelBooking = async (bookingId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/user/booking/${bookingId}/cancel`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to cancel booking");
    }
};

export const adminLogin = async (formData: LoginFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}

export type BookingData = {
    bookingId: string;
    page: string;
}

export const loadBookingsTable = async (BookingData: BookingData): Promise<SearchBookingResponse> => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("bookingId", BookingData.bookingId || "");
        queryParams.append("page", BookingData.page || "");
        const response = await fetch(`${API_BASE_URL}/api/admin/bookings?${queryParams}`, {
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Failed to load orders");
        }
        return response.json();
    } catch (error) {
        console.error("Error loading orders:", error);
        throw new Error("Failed to load orders");
    }
}

export const loadBookingDetails = async (bookingId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Failed to load booking details");
        }
        return response.json();
    } catch (error) {
        console.error("Error loading orders:", error);
        throw new Error("Failed to load orders");
    }
}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/validate-token`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Invalid Token");
    }

    return response.json();
}