import express from 'express';
import verifyAdminToken from '../middleware/auth';
import { check } from 'express-validator';
import { adminAuthorization, adminLogin, adminLogout } from '../controllers/admin.controller';
const adminRouter = express.Router();

adminRouter.post("/login",
    [
        check("email", "Email required").isEmail(),
        check("password", "Password required").isLength({ min: 6 }),
    ],
    adminLogin);

adminRouter.get("/validate-token", verifyAdminToken, adminAuthorization);

adminRouter.post("/logout", adminLogout);

export default adminRouter;