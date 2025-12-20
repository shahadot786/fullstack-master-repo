import { Resend } from "resend";
import { config } from "@config/index";

let resend: Resend;

export const initializeEmailService = () => {
    // Initialize Resend with API key
    resend = new Resend(config.email.resendApiKey);
    console.log('✅ Resend email service initialized');
};

export interface SendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
    if (!resend) {
        throw new Error("Email service not initialized");
    }

    try {
        console.log(`📧 Attempting to send email to: ${options.to}`);
        
        const { data, error } = await resend.emails.send({
            from: config.email.from,
            to: options.to,
            subject: options.subject,
            html: options.html || options.text || '',
        });

        if (error) {
            console.error(`❌ Resend API error:`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        console.log(`✅ Email sent successfully to: ${options.to}, ID: ${data?.id}`);
    } catch (error: any) {
        console.error(`❌ Failed to send email to: ${options.to}`, error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export const sendOTPEmail = async (
    email: string,
    otp: string,
    purpose: "verification" | "password-reset" | "email-change" | "email-verification"
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #333;
          background: #f5f5f5;
          padding: 20px;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 40px 30px;
          text-align: center;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 15px;
          display: block;
        }
        .header h1 { 
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }
        .header p { 
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          margin: 0;
          font-weight: 400;
        }
        .content { 
          padding: 40px 30px;
        }
        .content h2 {
          font-size: 22px;
          color: #1a1a1a;
          margin: 0 0 20px;
          font-weight: 600;
        }
        .content p {
          color: #666;
          margin: 0 0 20px;
          font-size: 15px;
        }
        .otp-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-label {
          font-size: 13px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .otp-code { 
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 8px;
          color: #667eea;
          font-family: 'Courier New', monospace;
          margin: 10px 0;
        }
        .expiry-text {
          font-size: 13px;
          color: #888;
          margin-top: 15px;
        }
        .info-box {
          background: #fff9e6;
          border-left: 4px solid #ffd700;
          padding: 15px 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .info-box p {
          margin: 0;
          color: #856404;
          font-size: 14px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .footer p {
          color: #6c757d;
          font-size: 13px;
          margin: 5px 0;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper { border-radius: 0; }
          .header { padding: 30px 20px; }
          .content { padding: 30px 20px; }
          .otp-code { font-size: 28px; letter-spacing: 6px; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <img src="https://nexus-web-portal-demo.vercel.app/nexus-logo.png" alt="Nexus Logo" class="logo" />
          <h1>Nexus</h1>
          <p>Full-Stack MERN Application</p>
        </div>
        
        <div class="content">
          <h2>${purposeText}</h2>
          <p>Hello! We received a request to verify your email address. Please use the code below to complete the process.</p>
          
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="expiry-text">⏱️ Expires in ${config.otp.expiryMinutes} minutes</div>
          </div>
          
          <div class="info-box">
            <p><strong>🔒 Security Notice:</strong> If you didn't request this code, please ignore this email. Your account is safe.</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Nexus</strong> - Secure Authentication System</p>
          <p style="margin-top: 10px;">This is an automated email. Please do not reply to this message.</p>
          <p style="margin-top: 15px; color: #999;">© ${new Date().getFullYear()} Nexus. All rights reserved.</p>
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
