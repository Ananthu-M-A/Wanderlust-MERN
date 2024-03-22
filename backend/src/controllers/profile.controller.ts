import { Request, Response } from "express";
import User from "../models/user";
import { UserType } from "../shared/types";
import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary';


export const loadProfile = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
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

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


async function uploadImage(imageFile: Express.Multer.File) {
    const imageBase64 = Buffer.from(imageFile.buffer).toString("base64");
    let dataURI = "data:" + imageFile.mimetype + ";base64," + imageBase64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
}