import express, { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import verifyToken from "../middleware/auth";
import { error } from 'console';

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
})

router.post("/register",
    [
        check("email", "Email required").isEmail(),
        check("mobile", "Mobile required").isNumeric().isLength({ min: 10, max: 10 }),
        check("password", "Password required").isLength({ min: 6 }),
        check("firstName", "First name required").isString(),
        check("lastName", "Last name required").isString(),
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
            user = new User(req.body);
            await user.save();

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
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "Something went wrong!" });
        }
    });

export default router;