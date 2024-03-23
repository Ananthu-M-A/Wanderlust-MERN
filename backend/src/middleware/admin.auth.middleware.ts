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
    try {
    const token = req.cookies["admin_token"];
    if (!token) {
        console.log("Admin unauthorized");
        return res.status(401).json({ message: "Admin unauthorized" });
    }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        req.adminId = (decoded as JwtPayload).adminId;
        next();
    } catch (error) {
        console.log("Admin unauthorized");        
        return res.status(401).json({ message: "Admin unauthorized" }); 
    }
};

export default verifyAdminToken;