import express, { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import verifyAdminToken from '../middleware/adminAuth';

const router = express.Router();

router.post("/adminLogin",
    [
        check("email", "Email required").isEmail(),
        check("password", "Password required").isLength({ min: 6 }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        const { email, password } = req.body;
        try {
            let admin = await User.findOne({
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
            console.log(error);
            return res.status(500).send({ message: "Something went wrong!" });
        }
    });

router.get("/validate-admin-token", verifyAdminToken, (req: Request, res: Response) => {
    res.status(200).send({ adminId: req.adminId });
});

router.post("/adminLogout", (req: Request, res: Response) => {
    res.cookie("admin_token", "",{
        expires: new Date(0),
    });
    res.send();
});

export default router;