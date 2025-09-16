FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Expose port (for local clarity, Cloud Run injects $PORT)
EXPOSE 8080

# Start the app
CMD ["node", "dist/main.js"]
