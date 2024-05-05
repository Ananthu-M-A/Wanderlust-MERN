import axios, { AxiosResponse } from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { BookingData, BookingType, HotelType, LoginFormData, PaymentData, RegisterFormData, ResetPasswordFormData, RestaurantType, SearchBookingResponse, SearchHotelResponse, SearchParams, SearchRestaurantParams, SearchRestaurantResponse, SearchUserResponse, UserType } from '../../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUB_KEY;

export const loadCurrentUser = async (): Promise<UserType> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/users/load-user`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error("Error loading user");
    }
}

export const loadAccount = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error("Error loading user");
    }
}

export const register = async (formData: RegisterFormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/register`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });

        localStorage.setItem("otpToken", response.data.otpToken);
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const resetPassword = async (formData: ResetPasswordFormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/reset-password`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });

        localStorage.setItem("otpToken", response.data.otpToken);
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const updateProfile = async (formData: FormData) => {
    console.log(formData);

    try {
        const response = await axios.put(`${API_BASE_URL}/api/user/profile/update`, formData, {
            withCredentials: true
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const verifyRegistration = async (otp: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/verify-registration`, { otp }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const verifyResetPassword = async (otp: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/verify-reset-password`, { otp }, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const login = async (formData: LoginFormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/login`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}


export const validateAdminToken = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/validate-token`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error("Invalid Token");
    }
}

export const logout = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/user/logout`, null, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error("Error during Logout");
    }
};


export const adminLogout = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/admin/logout`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error("Error during Logout");
    }
};

export const addHotel = async (hotelFormData: FormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/admin/hotels/create-hotel`, hotelFormData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to add Hotel");
    }
};

export const addRestaurant = async (restaurantFormData: FormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/admin/restaurants/create-restaurant`, restaurantFormData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to add Restaurant");
    }
};

export const loadHotels = async (searchParams: SearchParams): Promise<SearchHotelResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("page", searchParams.page || "");

    try {
        const response: AxiosResponse<SearchHotelResponse> = await axios.get(`${API_BASE_URL}/api/admin/hotels`, {
            params: queryParams,
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        throw new Error("Failed to load hotels");
    }
};

export const loadRestaurants = async (searchParams: SearchParams): Promise<SearchRestaurantResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("page", searchParams.page || "");

    try {
        const response: AxiosResponse<SearchRestaurantResponse> = await axios.get(`${API_BASE_URL}/api/admin/restaurants`, {
            params: queryParams,
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        throw new Error("Failed to load restaurants");
    }
};

export const blockHotel = async (hotelId: string) => {
    try {
        await axios.put(`${API_BASE_URL}/api/admin/hotels/${hotelId}/block`, null, {
            withCredentials: true,
        });
    } catch (error) {
        throw new Error("Failed to block hotel");
    }
};

export const unblockHotel = async (hotelId: string) => {
    try {
        await axios.put(`${API_BASE_URL}/api/admin/hotels/${hotelId}/unblock`, null, {
            withCredentials: true,
        });
    } catch (error) {
        throw new Error("Failed to unblock hotel");
    }
};

export const blockRestaurant = async (restaurantId: string) => {
    try {
        await axios.put(`${API_BASE_URL}/api/admin/restaurants/${restaurantId}/block`, null, {
            withCredentials: true,
        });
    } catch (error) {
        throw new Error("Failed to block restaurant");
    }
};

export const unblockRestaurant = async (restaurantId: string) => {
    try {
        await axios.put(`${API_BASE_URL}/api/admin/restaurants/${restaurantId}/unblock`, null, {
            withCredentials: true,
        });
    } catch (error) {
        throw new Error("Failed to unblock restaurant");
    }
};

export const loadHotelById = async (hotelId: string): Promise<HotelType> => {
    try {
        const response: AxiosResponse<HotelType> = await axios.get(`${API_BASE_URL}/api/admin/hotels/${hotelId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to load hotel");
    }
}

export const loadRestaurantById = async (restaurantId: string): Promise<RestaurantType> => {
    try {
        const response: AxiosResponse<RestaurantType> = await axios.get(`${API_BASE_URL}/api/admin/restaurants/${restaurantId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to load restaurant");
    }
}

export const updateHotelById = async (hotelFormData: FormData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/admin/hotels/${hotelFormData.get("hotelId")}/update`, hotelFormData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to update hotel");
    }
}

export const updateRestaurantById = async (restaurantFormData: FormData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/admin/restaurants/${restaurantFormData.get("restaurantId")}/update`, restaurantFormData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to update restaurant");
    }
}

export const loadUsers = async (searchParams: SearchParams): Promise<SearchUserResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("page", searchParams.page || "");

    try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
            params: queryParams,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to load users");
    }
};

export const blockUser = async (userId: string) => {
    try {
        await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/block`, null, {
            withCredentials: true
        });
    } catch (error) {
        throw new Error("Failed to block user");
    }
};

export const unblockUser = async (userId: string) => {
    try {
        await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/unblock`, null, {
            withCredentials: true
        });
    } catch (error) {
        throw new Error("Failed to unblock user");
    }
};

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

    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/home/search-hotels`, {
            params: queryParams
        });
        return response.data;
    } catch (error) {
        throw new Error("Error searching hotels");
    }
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

    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/home/search-restaurants`, {
            params: queryParams
        });
        return response.data;
    } catch (error) {
        throw new Error("Error searching restaurants");
    }
}

export const loadHotelHomeById = async (hotelId: string): Promise<HotelType> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/home/search-hotels/${hotelId}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to update hotels");
    }
}

export const createCheckoutSession = async (paymentData: PaymentData) => {
    try {
        const stripe = await loadStripe(PUBLIC_KEY);

        const response = await axios.post(`${API_BASE_URL}/api/user/booking/checkout`, paymentData, {
            headers: {
                'Content-Type': 'application/json'
            },
            // withCredentials: true
        });

        console.log("RESPONSE", response);

        if (response.status !== 200) {
            throw new Error("Failed to create checkout session");
        }

        const session = response.data;

        console.log("SESSION", session);

        const result = stripe?.redirectToCheckout({
            sessionId: session.id
        });

        console.log("Redirecting to checkout...", result);
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw new Error("Failed to initiate payment");
    }
}

export const loadBookings = async (query: string): Promise<BookingType[]> => {
    try {
        console.log(query);

        const response = await axios.get(`${API_BASE_URL}/api/user/booking/bookings?bookingId=${query}`, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error("Error loading bookings:", error);
        throw new Error("Failed to load bookings");
    }
}

export const downloadDoc = async (bookingId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/booking/${bookingId}/receipt`, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/pdf',
            },
            withCredentials: true
        });

        const url = URL.createObjectURL(new Blob([response.data]));
        return url;
    } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
    }
}

export const cancelBooking = async (bookingId: string) => {
    try {
        await axios.put(`${API_BASE_URL}/api/user/booking/${bookingId}/cancel`, null, {
            withCredentials: true
        });
    } catch (error) {
        throw new Error("Failed to cancel booking");
    }
};

export const adminLogin = async (formData: LoginFormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/admin/login`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const loadBookingsTable = async (BookingData: BookingData): Promise<SearchBookingResponse> => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("bookingId", BookingData.bookingId || "");
        queryParams.append("page", BookingData.page || "");
        const response = await axios.get(`${API_BASE_URL}/api/admin/bookings?${queryParams}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error loading orders:", error);
        throw new Error("Failed to load orders");
    }
}

export const loadBookingDetails = async (bookingId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error loading booking details:", error);
        throw new Error("Failed to load booking details");
    }
}

export const validateToken = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/validate-token`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error validating token:", error);
        throw new Error("Invalid Token");
    }
}