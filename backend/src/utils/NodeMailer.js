"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendBookingMail = (res, recipientEmail, subject, emailContent, attachments) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.NODE_MAILER_EMAIL,
                pass: process.env.NODE_MAILER_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: recipientEmail,
            subject,
            text: emailContent,
            attachments
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                const errorMsg = "Error sending email";
                res.status(400).json({ message: errorMsg });
            }
            else {
                console.log('Email sent successfully:', info.response);
            }
        });
    }
    catch (error) {
        console.log("Error sending email", error);
    }
};
exports.sendBookingMail = sendBookingMail;
