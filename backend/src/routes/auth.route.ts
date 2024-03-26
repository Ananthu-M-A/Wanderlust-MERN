import express from 'express';
import { userRegistration, verifyRegistration, userLogin, userAuthorization, userLogout, loadUser } from '../controllers/auth.controller';
import verifyToken from '../middlewares/user.auth.middleware';
import { validateLogin, validateRegister } from '../utils/FormValidator';

const authRouter = express.Router();

authRouter.post("/register", validateRegister, userRegistration);
authRouter.post("/verifyRegistration", verifyRegistration);
authRouter.post("/login", validateLogin, userLogin);
authRouter.get("/validate-token", verifyToken, userAuthorization);
authRouter.post("/logout", userLogout);
authRouter.get('/load-user', verifyToken, loadUser);


export default authRouter;