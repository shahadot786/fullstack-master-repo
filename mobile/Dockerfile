# Dockerfile for Expo Mobile Development Server
# Note: For production builds, use EAS Build (https://docs.expo.dev/build/introduction/)
# This Dockerfile is for running the Expo development server in a container

FROM node:18-alpine

# Install Expo CLI globally
RUN npm install -g expo-cli @expo/ngrok

# Create app directory
WORKDIR /app

# Copy package files
COPY mobile/package.json mobile/yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy app source
COPY mobile/ ./

# Expose Expo ports
# 8081: Metro bundler
# 19000: Expo DevTools
# 19001: Expo DevTools (secure)
# 19002: Expo DevTools (web)
EXPOSE 8081 19000 19001 19002

# Set environment variables
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Start Expo development server
CMD ["yarn", "start", "--host", "tunnel"]
