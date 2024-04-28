"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.check)("email")
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid Email')
        .normalizeEmail(),
    (0, express_validator_1.check)("mobile")
        .notEmpty().withMessage('Mobile number is required')
        .isNumeric().withMessage('Mobile number must be a number')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits'),
    (0, express_validator_1.check)("password")
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.check)("firstName")
        .notEmpty().withMessage('First name is required')
        .isString().withMessage('First name must be a characters'),
    (0, express_validator_1.check)("lastName")
        .notEmpty().withMessage('Last name is required')
        .isString().withMessage('Last name must be a characters'),
];
exports.validateLogin = [
    (0, express_validator_1.check)("email")
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid Email')
        .normalizeEmail(),
    (0, express_validator_1.check)("password")
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
