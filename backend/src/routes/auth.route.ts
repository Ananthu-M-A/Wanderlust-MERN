import express from 'express';
import { userRegistration, verifyRegistration, userLogin, userAuthorization, userLogout, loadUser, resetPassword, verifyResetPassword } from '../controllers/auth.controller';
import verifyToken from '../middlewares/user.auth.middleware';
import { validateLogin, validateRegister } from '../utils/FormValidator';

const authRouter = express.Router();

authRouter.post("/register", validateRegister, userRegistration);
authRouter.post("/verify-registration", verifyRegistration);
authRouter.post("/login", validateLogin, userLogin);
authRouter.get("/validate-token", verifyToken, userAuthorization);
authRouter.post("/logout", userLogout);
authRouter.post("/reset-password", validateLogin, resetPassword);
authRouter.post("/verify-reset-password", verifyResetPassword);
authRouter.get('/load-user', verifyToken, loadUser);

export default authRouter;