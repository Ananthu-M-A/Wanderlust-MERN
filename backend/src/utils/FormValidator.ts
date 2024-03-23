import { check } from "express-validator";

export const validateRegister = [
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
];

export const validateLogin = [
    check("email")
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid Email')
        .normalizeEmail(),

    check("password")
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];