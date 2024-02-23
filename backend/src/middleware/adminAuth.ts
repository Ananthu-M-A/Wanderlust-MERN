import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            adminId: string;
        }
    }
}

const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["admin_token"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        req.adminId = (decoded as JwtPayload).adminId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" }); 
    }
};

export default verifyAdminToken;