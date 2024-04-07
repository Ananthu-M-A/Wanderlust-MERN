import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import '../interfaces/session.interface';
import User from "../models/user.model";


const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["auth_token"];
        if (!token) {
            console.log("User unauthorized");
            return res.status(401).json({ message: "User unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const userActivityStatus = await User.findOne({ _id: (decoded as JwtPayload).userId }, { isBlocked: 1, _id: 0 })
        if ((userActivityStatus && userActivityStatus.isBlocked)) {
            console.log("User blocked");
            return res.status(401).json({ message: "User blocked" });
        }
        req.userId = (decoded as JwtPayload).userId;
        next();
    } catch (error) {
        console.log("User unauthorized", error);
        return res.status(401).json({ message: "User unauthorized" });
    }
};

export default verifyToken;