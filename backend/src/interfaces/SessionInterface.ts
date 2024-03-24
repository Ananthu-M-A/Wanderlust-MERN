import { SessionData } from 'express-session';
import { BookingType } from '../shared/types';
import { Request } from 'express';

export interface CustomRequest extends Request {
    userId: string;
    adminId: string;
}


interface CustomSessionData extends SessionData {
    userSignupData?: {
        email: string;
        mobile: string;
        password: string;
        firstName: string;
        lastName: string;
        otp: string;
        otpExpiry: Date;
    };
    userLoginData?: {
        email: string;
        password: string;
        otp: string;
        otpExpiry: Date;
    };
    user: {
        _id: object;
    };
    userId: object;
    status: string;
    adminLoginData?: {
        adminName: string;
        adminPassword: string;
        otp: string;
        otpExpiry: Date;
    };
    admin: {
        _id: object;
    };
    adminId: object;
    paymentData: BookingType;
}

declare module 'express-session' {
    interface Session extends CustomSessionData { }
}

export interface SessionUserData {
    email: string;
    mobile: string;
    password: string;
    firstname: string;
    lastname: string;
    otp: string;
    otpExpiry: Date;
}

export interface SessionUserData2 {
    email: string;
    password: string;
    otp: string;
    otpExpiry: Date;
}

export interface SessionAdminData {
    adminName: string;
    adminPassword: string;
    otp: string;
    otpExpiry: Date;
}