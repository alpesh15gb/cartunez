FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 9000

# Environment
ENV NODE_ENV=production

# Start the application in production mode (Build at runtime to ensure artifacts exist)
CMD ["sh", "-c", "npm run build && npm run start"]
