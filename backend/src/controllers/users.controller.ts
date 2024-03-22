import { Request, Response } from "express";
import User from "../models/user";
import { SearchUserResponse } from "../shared/types";

export const loadUsers = async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);
        const pageSize = 10;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const users = await User.find(query).skip(skip).limit(pageSize);
        const total = await User.countDocuments({ ...query, isBlocked: false });
        const response: SearchUserResponse = {
            data: users,
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

export const blockUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const users = (await User.findOneAndUpdate({ _id: userId }, { isBlocked: true }, { new: true }))
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error updating users" });
    }
};

export const unblockUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const users = (await User.findOneAndUpdate({ _id: userId }, { isBlocked: false }, { new: true }))
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error updating users" });
    }
};

const constructSearchQuery = (queryParams: any) => {
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