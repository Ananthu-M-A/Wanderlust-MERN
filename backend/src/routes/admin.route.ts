import express from 'express';
import verifyAdminToken from '../middlewares/admin.auth.middleware';
import { adminAuthorization, adminLogin, adminLogout } from '../controllers/admin.controller';
import { validateLogin } from '../utils/FormValidator';

const adminRouter = express.Router();

adminRouter.post("/login", validateLogin, adminLogin);
adminRouter.get("/validate-token", verifyAdminToken, adminAuthorization);
adminRouter.post("/logout", adminLogout);

export default adminRouter;