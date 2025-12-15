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
    transporter.verify((error, success) => {
        if (error) {
            console.error("❌ Email service error:", error);
        } else {
            console.log("✅ Email service is ready");
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
        console.log(`📧 Email sent to ${options.to}`);
    } catch (error) {
        console.error("Email send error:", error);
        throw new Error("Failed to send email");
    }
};

export const sendOTPEmail = async (
    email: string,
    otp: string,
    purpose: "verification" | "password-reset"
): Promise<void> => {
    const subject =
        purpose === "verification"
            ? "Verify Your Email - OTP Code"
            : "Password Reset - OTP Code";

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
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Fullstack Master</h1>
        </div>
        <div class="content">
          <h2>${purpose === "verification" ? "Email Verification" : "Password Reset"}</h2>
          <p>Your OTP code is:</p>
          <div class="otp-box">${otp}</div>
          <p>This code will expire in ${config.otp.expiryMinutes} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 Fullstack Master. All rights reserved.</p>
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
