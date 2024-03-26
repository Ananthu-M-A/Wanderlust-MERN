import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import '../interfaces/session.interface';


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["auth_token"];
        if (!token) {
            console.log("User unauthorized");
            return res.status(401).json({ message: "User unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        req.userId = (decoded as JwtPayload).userId;
        next();
    } catch (error) {
        console.log("User unauthorized", error);
        return res.status(401).json({ message: "User unauthorized" });
    }
};

export default verifyToken;