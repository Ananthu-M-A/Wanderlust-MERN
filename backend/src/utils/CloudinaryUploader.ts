import express, { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (imageFile: Express.Multer.File) =>
    (await cloudinary.uploader.upload(`data:${imageFile.mimetype};base64,${Buffer.from(imageFile.buffer).toString("base64")}`)).url;

const uploadImages = async (imageFiles: Express.Multer.File[]) =>
    await Promise.all(imageFiles.map(async (imageFile) =>
        (await cloudinary.uploader.upload(`data:${imageFile.mimetype};base64,${Buffer.from(imageFile.buffer).toString("base64")}`)).url
    ));

export { uploadImage, uploadImages };
