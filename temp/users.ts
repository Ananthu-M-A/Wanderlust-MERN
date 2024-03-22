import express, { Request, Response } from 'express';
import User from '../backend/src/models/user';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { check, validationResult } from 'express-validator';
import verifyToken from "../backend/src/middleware/auth";
import { SessionUserData } from '../backend/src/interfaces/SessionInterface';
import { transporter } from '../backend/src/utils/NodeMailer';
import verifyAdminToken from '../backend/src/middleware/adminAuth';
import { SearchUserResponse } from '../backend/src/shared/types';

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
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
})

router.post("/register",
    [
        check("email")
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid Email')
            .normalizeEmail(),

        check("mobile")
            .notEmpty().withMessage('Mobile number is required')
            .isNumeric().withMessage('Mobile number must be a number')
            .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits'),

        check("password")
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

        check("firstName")
            .notEmpty().withMessage('First name is required')
            .isString().withMessage('First name must be a characters'),

        check("lastName")
            .notEmpty().withMessage('Last name is required')
            .isString().withMessage('Last name must be a characters'),
    ],
    async (req: Request, res: Response) => {
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
    });

router.post("/verifyRegistration", async (req: Request, res: Response) => {
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
});


router.put('/:userId/block', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const users = (await User.findOneAndUpdate({ _id: userId }, { isBlocked: true }, { new: true }))
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error updating users" });
    }
});


router.put('/:userId/unblock', verifyAdminToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const users = (await User.findOneAndUpdate({ _id: userId }, { isBlocked: false }, { new: true }))
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error updating users" });
    }
});


router.get('/', verifyAdminToken, async (req: Request, res: Response) => {
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
});

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
};

export default router;