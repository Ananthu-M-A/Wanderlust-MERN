import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import '../interfaces/session.interface';

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        const { email, password } = req.body;
        const admin = await User.findOne({
            email: email,
        });
        if (!admin || !admin.role.includes("admin")) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign({ adminId: admin.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' },
        );
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });
        return res.status(200).json({ adminId: admin._id });
    } catch (error) {
        console.log("Error in admin login", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const adminAuthorization = (req: Request, res: Response) => {
    try {
        res.status(200).send({ adminId: req.adminId });
    } catch (error) {
        console.log("Error in authorizing admin", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const adminLogout = (req: Request, res: Response) => {
    try {
        res.cookie("admin_token", "", {
            expires: new Date(0),
        });
        res.send();
    } catch (error) {
        console.log("Error in admin logout", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};
