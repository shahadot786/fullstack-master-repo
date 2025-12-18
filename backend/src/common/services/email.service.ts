import nodemailer from "nodemailer";
import { config } from "@config/index";

let transporter: nodemailer.Transporter;

export const initializeEmailService = () => {
    transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.user,
            pass: config.email.password,
        },
    });

    // Verify connection
    transporter.verify((error) => {
        if (error) {
            // Email service error - silently fail
        }
    });
};

export interface SendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
    if (!transporter) {
        throw new Error("Email service not initialized");
    }

    const mailOptions = {
        from: config.email.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

export const sendOTPEmail = async (
    email: string,
    otp: string,
    purpose: "verification" | "password-reset" | "email-change"
): Promise<void> => {
    const subject =
        purpose === "verification"
            ? "Verify Your Email - OTP Code"
            : purpose === "email-change"
            ? "Email Change Verification - OTP Code"
            : "Password Reset - OTP Code";

    const purposeText =
        purpose === "verification"
            ? "Email Verification"
            : purpose === "email-change"
            ? "Email Change Verification"
            : "Password Reset";

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
        .otp-box { background: white; border: 2px solid #4F46E5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nexus</h1>
          <p style="color: #e0e0e0; font-size: 14px; margin-top: 5px;">Full-Stack MERN Application</p>
        </div>
        <div class="content">
          <h2>${purposeText}</h2>
          <p>Your OTP code is:</p>
          <div class="otp-box">${otp}</div>
          <p>This code will expire in ${config.otp.expiryMinutes} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            This is an automated email from Nexus. Please do not reply.
          </p>
          <p style="color: #6c757d; font-size: 12px; margin: 5px 0 0;">© 2024 Nexus. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: email,
        subject,
        html,
    });
};
