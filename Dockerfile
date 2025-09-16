# ---- Base Node image ----
FROM node:18-alpine AS base

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install only prod deps first (faster cache)
RUN npm install --only=production

# Copy rest of the source code
COPY . .

# ---- Build stage ----
FROM base AS build
RUN npm install
RUN npm run build

# ---- Production stage ----
FROM node:18-alpine AS prod

WORKDIR /usr/src/app

# Copy only built dist + production deps
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

# Expose NestJS default port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
