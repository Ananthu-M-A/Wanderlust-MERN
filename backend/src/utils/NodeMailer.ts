import nodemailer from 'nodemailer';
import { Response } from 'express';
import { Attachment } from 'nodemailer/lib/mailer';

export const sendBookingMail = (res: Response, recipientEmail: string, subject: string, emailContent: string, attachments?: Attachment[]) => {
  try {
    const transporter = nodemailer.createTransport({
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

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
        const errorMsg = "Error sending email";
        res.status(400).json({ message: errorMsg });
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });

  } catch (error: any) {
    console.log("Error sending email", error.message);
  }
}