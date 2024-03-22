import express from 'express';
import { userRegistration, verifyRegistration, userLogin, userAuthorization, userLogout, loadUser } from '../controllers/auth.controller';
import verifyToken from '../middleware/auth';
import { check } from 'express-validator';
const authRouter = express.Router();

authRouter.post("/register",
    [
        check("email")
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid Email')
            .normalizeEmail(),

        check("mobile")
            .notEmpty().withMessage('Mobile number is required')
            .isNumeric().withMessage('Mobile number must be a number')
            .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits'),

        check("password")
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

        check("firstName")
            .notEmpty().withMessage('First name is required')
            .isString().withMessage('First name must be a characters'),

        check("lastName")
            .notEmpty().withMessage('Last name is required')
            .isString().withMessage('Last name must be a characters'),
    ],
    userRegistration);

authRouter.post("/verifyRegistration", verifyRegistration);

authRouter.post("/login",
    [
        check("email", "Email required").isEmail(),
        check("password", "Password required").isLength({ min: 6 }),
    ],
    userLogin);

authRouter.get("/validate-token", verifyToken, userAuthorization);

authRouter.post("/logout", userLogout);

authRouter.get('/load-user', verifyToken, loadUser);


export default authRouter;