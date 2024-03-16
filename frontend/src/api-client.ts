import { LoginFormData } from "./pages/Login";
import { RegisterFormData } from "./pages/Register";
import { BookingType, HotelType, RestaurantType, SearchResponse, UserType } from '../../backend/src/shared/types';
import { loadStripe } from "@stripe/stripe-js";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const stripe = await loadStripe('pk_test_51OmXsJSFKXnVvS5mYKhovpdQ83qlQfCzxP9QRnOGMkwo60n8zQFqLa8fzfpaUVuaqmouwCH8NOcokyONxwPQUmHx00xxk61lmd');


export const loadCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error loading user");
    }
    return response.json();
}


export const loadAccount = async () => {
    const response = await fetch(`${API_BASE_URL}/api/home/load-account`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error loading user");
    }
    return response.json();
}


export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
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

    const response = await fetch(`${API_BASE_URL}/api/home/updateProfile`, {
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
    const response = await fetch(`${API_BASE_URL}/api/users/verifyRegistration`, {
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
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
    const response = await fetch(`${API_BASE_URL}/api/adminAuth/validate-admin-token`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Invalid Token");
    }

    return response.json();
}

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error during Logout");
    }
};


export const adminLogout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/adminAuth/adminLogout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error during Logout");
    }
};


export const addHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`, {
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
    const response = await fetch(`${API_BASE_URL}/api/restaurants`, {
        method: 'POST',
        credentials: "include",
        body: restaurantFormData,
    });

    if (!response.ok) {
        throw new Error("Failed to add Restaurant");
    }

    return response.json();
};


export const loadHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to load hotels");
    }

    return response.json();
};

export const loadRestaurants = async (): Promise<RestaurantType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/restaurants`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to load restaurants");
    }

    return response.json();
};

export const blockHotel = async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/block`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to block hotel");
    }
};


export const unblockHotel = async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/unblock`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to unblock hotel");
    }
};

export const blockRestaurant = async (restaurantId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/block`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to block restaurant");
    }
};


export const unblockRestaurant = async (restaurantId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/unblock`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to unblock restaurant");
    }
};

export const loadHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to load hotel");
    }
    return response.json();
}

export const loadRestaurantById = async (restaurantId: string): Promise<RestaurantType> => {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`, {
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to load restaurant");
    }
    return response.json();
}


export const updateHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelFormData.get("hotelId")}`, {
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
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantFormData.get("restaurantId")}`, {
        method: "PUT",
        body: restaurantFormData,
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to update restaurant");
    }
    return response.json();
}

export const loadUsers = async (): Promise<UserType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to load users");
    }

    return response.json();
};


export const blockUser = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/block`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to block user");
    }
};


export const unblockUser = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/unblock`, {
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

export const searchHotels = async (searchParams: SearchParams): Promise<SearchResponse> => {
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

    const response = await fetch(`${API_BASE_URL}/api/home/search?${queryParams}`);
    if (!response.ok) {
        throw new Error("Error searching hotels");
    }
    return response.json();
}


export const loadHotelHomeById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/home/${hotelId}`);
    if (!response.ok) {
        throw new Error("Failed to update hotels");
    }
    return response.json();
}


export const createCheckoutSession = async (paymentData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/home/create-checkout-session`, {
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

export const loadOrders = async (): Promise<BookingType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/home/load-orders`,{
        credentials: "include"
    });    
    if (!response.ok) {
        throw new Error("Failed to update hotels");
    }
    return response.json();
}

export const adminLogin = async (formData: LoginFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/adminAuth/adminLogin`, {
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

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Invalid Token");
    }

    return response.json();
}