# Advanced Authentication Features

This document describes the advanced authentication features including refresh tokens, email verification, password reset, Redis caching, and WebSocket support.

## Features Overview

### 1. Email Verification with 6-Digit OTP
- Users receive a 6-digit OTP code upon registration
- OTP expires after 10 minutes (configurable)
- OTP stored in Redis for fast verification
- Resend OTP functionality available

### 2. Refresh Token System
- Long-lived refresh tokens (30 days default)
- Stored in Redis for revocation capability
- Automatic token rotation on refresh
- Logout invalidates refresh token

### 3. Password Reset Flow
- Request password reset with email
- Receive 6-digit OTP code
- Reset password with OTP verification
- All sessions invalidated after password reset

### 4. Redis Caching
- OTP storage with automatic expiration
- Refresh token management
- General-purpose caching utilities
- TLS support for secure connections

### 5. WebSocket Support
- Real-time notifications
- JWT authentication for WebSocket connections
- User-specific event rooms
- Example events for email verification and password reset

## API Endpoints

### Email Verification

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

Response includes access token, refresh token, and message to check email for OTP.

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Resend Verification OTP
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Refresh Token

#### Refresh Access Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

Returns new access token and refresh token.

### Password Reset

#### Request Password Reset
```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Sends 6-digit OTP to email if user exists.

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

## Environment Variables

Add these to your `.env` file:

```env
# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=30d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TLS=false

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@fullstack-master.com

# OTP
OTP_EXPIRY_MINUTES=10
```

## Email Configuration

### Using Gmail

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `EMAIL_PASSWORD`

### Using Other Providers

Update `EMAIL_HOST`, `EMAIL_PORT`, and `EMAIL_SECURE` according to your provider:

- **SendGrid**: `smtp.sendgrid.net`, port `587`
- **Mailgun**: `smtp.mailgun.org`, port `587`
- **AWS SES**: `email-smtp.region.amazonaws.com`, port `587`

## Redis Setup

### Local Development

```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Or install Redis locally
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis
```

### Production with TLS

For production, use a managed Redis service with TLS:

- **Redis Cloud**: Free tier available
- **AWS ElastiCache**: Managed Redis
- **Upstash**: Serverless Redis with TLS

Set `REDIS_TLS=true` in production.

## WebSocket Usage

### Client Connection

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  auth: {
    token: "your-jwt-access-token"
  }
});

socket.on("connect", () => {
  console.log("Connected to WebSocket");
});

socket.on("email:verified", (data) => {
  console.log("Email verified:", data);
});

socket.on("password:reset", (data) => {
  console.log("Password reset:", data);
});

// Ping-pong example
socket.emit("ping");
socket.on("pong", (data) => {
  console.log("Pong received:", data);
});
```

### Server-Side Events

Emit events to specific users:

```typescript
import { emitToUser } from "@common/services/websocket.service";

// Notify user when email is verified
emitToUser(userId, "email:verified", {
  message: "Your email has been verified",
  timestamp: new Date().toISOString()
});
```

## Security Best Practices

1. **JWT Secrets**: Use strong, random secrets (min 32 characters)
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Already configured for auth endpoints
4. **OTP Expiry**: Keep OTP expiry short (10 minutes default)
5. **Refresh Token Rotation**: Tokens rotate on each refresh
6. **Redis TLS**: Enable TLS for Redis in production
7. **Email Verification**: Consider requiring email verification before full access

## Testing

### Manual Testing

```bash
# 1. Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'

# Check email for OTP (or check Redis)
redis-cli GET "otp:email-verification:test@example.com"

# 2. Verify email
curl -X POST http://localhost:8000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# 3. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# 4. Refresh token
curl -X POST http://localhost:8000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token"}'

# 5. Request password reset
curl -X POST http://localhost:8000/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 6. Reset password
curl -X POST http://localhost:8000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","newPassword":"NewPass1234"}'
```

## Troubleshooting

### Redis Connection Issues
- Check Redis is running: `redis-cli ping`
- Verify host and port in `.env`
- Check firewall rules

### Email Not Sending
- Verify email credentials
- Check spam folder
- Enable "Less secure app access" for Gmail (or use App Password)
- Check email service logs

### WebSocket Connection Failed
- Ensure HTTP server is created before WebSocket initialization
- Check CORS configuration
- Verify JWT token is valid

### OTP Not Working
- Check Redis connection
- Verify OTP hasn't expired
- Check Redis key format: `otp:email-verification:email@example.com`

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ├─── HTTP/REST ───┐
       │                 │
       └─── WebSocket ───┤
                         │
                    ┌────▼────┐
                    │ Express │
                    │  Server │
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ MongoDB │    │  Redis  │    │  Email  │
    │         │    │  (OTP)  │    │ Service │
    └─────────┘    └─────────┘    └─────────┘
```

## Next Steps

1. Add email templates with HTML/CSS styling
2. Implement rate limiting for OTP requests
3. Add account lockout after failed attempts
4. Implement 2FA (TOTP) as optional security layer
5. Add OAuth providers (Google, GitHub, etc.)
6. Implement session management dashboard
7. Add email notification preferences
