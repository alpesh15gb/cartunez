FROM node:20

WORKDIR /app/medusa-backend

# Install python and build tools for native dependencies like bcrypt/sqlite if needed
# RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

# Build the payload or scripts
RUN npm run build

EXPOSE 9000

# Start medusa backend
CMD ["npx", "medusa", "start"]
