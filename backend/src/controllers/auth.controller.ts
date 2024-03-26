import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendBookingMail } from '../utils/NodeMailer';
import '../interfaces/session.interface';


export const userRegistration = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        const user = await User.findOne({
            email: req.body.email,
        });
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const generateOTP = () => {
            return crypto.randomInt(100000, 999999).toString();
        };

        const currentDate = new Date();
        const otpTimeout = 30;
        const otp = generateOTP();
        const otpExpiry = new Date(currentDate.getTime() + otpTimeout * 1000);

        const { email, mobile, password, firstName, lastName } = req.body;

        if (!req.session) {
            return res.status(400).json({ message: "Session not available" });
        }

        req.session.userSignupData = { email, mobile, password, firstName, lastName, otp, otpExpiry };

        const subject = `OTP Verification - [WANDERLUST]`;
        const bookingMail = `Your OTP is: ${otp}`;
        sendBookingMail(res, req.session.userSignupData.email, subject, bookingMail);
        res.status(200).json({ status: "Success", message: "Registration Initiated!" });

    } catch (error) {
        console.log("Error in user registration", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const verifyRegistration = async (req: Request, res: Response) => {
    try {
        const enteredOtp = req.body.otp;
        const userSignupData = req.session.userSignupData;

        if (!userSignupData) {
            console.log("User data not found in session.");
            return res.status(400).json({ message: "Error in creating account.." });
        }
        const otpExpiry = new Date(userSignupData.otpExpiry);
        const currentTime = new Date();


        if (currentTime > otpExpiry) {
            console.log("OTP timeout");
            return res.status(400).json({ message: "OTP Timeout" });
        }

        if (enteredOtp === userSignupData.otp) {
            const { email, mobile, password, firstName, lastName } = userSignupData;
            const isBlocked: boolean = false;
            const user = new User({ email, mobile, password, firstName, lastName, isBlocked });
            await user.save();

            if (user) {
                req.session.userSignupData = undefined;
                const token = jwt.sign({ userId: user.id },
                    process.env.JWT_SECRET_KEY as string,
                    { expiresIn: '1d' },
                );
                res.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 86400000
                });
                return res.status(200).send({ message: "User registered, OK" });
            } else {
                return res.status(400).json({ message: "Error creating account.." });
            }
        } else {
            console.log("Invalid OTP");
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        console.log("Error verifying registration", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email,
        });
        if (!user || user.role.includes("admin")) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        if (user.isBlocked) {
            return res.status(400).json({ message: "User not allowed!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign({ userId: user.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' },
        );
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });
        return res.status(200).json({ userId: user._id });
    } catch (error) {
        console.log("Error in user login", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const userAuthorization = (req: Request, res: Response) => {
    try {
        res.status(200).send({ userId: req.userId });
    } catch (error) {
        console.log("Error authorizing user", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};


export const userLogout = (req: Request, res: Response) => {
    try {
        res.cookie("auth_token", "", {
            expires: new Date(0),
        });
        res.send();
    } catch (error) {
        console.log("Error in user logout", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const loadUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }
        res.json(user);
    } catch (error) {
        console.log("Error loading user", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};