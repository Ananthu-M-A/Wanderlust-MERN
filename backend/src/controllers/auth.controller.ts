import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { transporter } from '../utils/NodeMailer';
import { SessionUserData } from '../interfaces/SessionInterface';


export const userRegistration = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }
    try {
        let user = await User.findOne({
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

        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: req.session.userSignupData.email,
            subject: 'OTP Verification',
            text: `Your OTP is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.log(error);
                const errorMsg = "Error sending OTP Email.";
                res.status(400).json({ message: errorMsg });
            } else {
                console.log('OTP email sent:', info.response);
            }
        });

        res.status(200).json({ status: "Success", message: "Registration Initiated!" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' });
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
        console.log("OTP verification failed", error);
        return res.status(400).json({ message: "Error creating account.." });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({
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
        console.log(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const userAuthorization = (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId });
};


export const userLogout = (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
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
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};