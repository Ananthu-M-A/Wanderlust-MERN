import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { SearchHotelResponse, SearchRestaurantResponse } from "../shared/types";
import Restaurant from "../models/restaurant";
import { validationResult } from "express-validator";

export const searchHotels = async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);
        let sortOption = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOption = { starRating: -1 }; break;
            case "pricePerNightAsc":
                sortOption = { ['roomTypes.price']: 1 }; break;
            case "pricePerNightDesc":
                sortOption = { ['roomTypes.price']: -1 }; break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = await Hotel.find({ ...query, isBlocked: false }).sort(sortOption).skip(skip).limit(pageSize);
        const total = await Hotel.countDocuments({ ...query, isBlocked: false });
        const response: SearchHotelResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };
        res.json(response);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const loadHotelDetails = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = req.params.hotelId.toString();
    try {
        const hotel = await Hotel.findById(id);
        res.json(hotel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error loading hotel" });
    }
};

export const searchRestaurants = async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);
        let sortOption = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOption = { starRating: -1 }; break;
            case "pricePerNightAsc":
                sortOption = { ['foodItems.price']: 1 }; break;
            case "pricePerNightDesc":
                sortOption = { ['foodItems.price']: -1 }; break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = await Restaurant.find({ ...query, isBlocked: false }).sort(sortOption).skip(skip).limit(pageSize);
        const total = await Restaurant.countDocuments({ ...query, isBlocked: false });
        const response: SearchRestaurantResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };
        res.json(response);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};



const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
            { name: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount)
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount)
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities]
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types]
        }
    }

    if (queryParams.stars) {
        constructedQuery.starRating = {
            $in: Array.isArray(queryParams.stars)
                ? queryParams.stars
                : [queryParams.stars]
        }
    }

    if (queryParams.maxPrice) {
        constructedQuery['roomTypes.price'] = {
            $lte: parseInt(queryParams.maxPrice)
        };
    }

    return constructedQuery
};