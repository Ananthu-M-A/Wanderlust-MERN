import { Request, Response } from "express";
import User from "../models/user.model";
import { UserType } from "../shared/types";
import bcrypt from 'bcryptjs';
import { uploadImage } from "../utils/CloudinaryUploader";
import { CustomRequest } from '../interfaces/SessionInterface';


export const loadProfile = async (req: CustomRequest, res: Response) => {
    try {
    const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }
        res.json(user);
    } catch (error: any) {
        console.log("Error in loading user profile", error.message);
        res.status(500).json({ message: "Something went wrong!" });
    }
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
    try {
    const userId = req.userId;
        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password }: UserType = req.body;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Enter correct password" });
        }

        const { firstName, lastName, email, mobile }: UserType = req.body;
        const updatedUser = await User.findOneAndUpdate({ _id: req.userId },
            { firstName, lastName, email, mobile }, { new: true });

        if (updatedUser) {
            if (req.file) {
                const file = req.file as Express.Multer.File;
                const updatedImageUrl = await uploadImage(file);
                updatedUser.imageUrl = updatedImageUrl;
            }
            await updatedUser.save();
            res.status(201).json(updatedUser);
        } else {
            res.status(500).json({ message: "Error updating profile" });
        }

    } catch (error: any) {
        console.log("Error in updating user profile", error.message);
        res.status(500).json({ message: "Something went wrong!" });
    }
};


