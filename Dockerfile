# -----------------------------
# Stage 1: Build Angular app
# -----------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install Angular CLI matching project version
RUN npm install -g @angular/cli@21

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Build Angular app for production
# Output to /app/dist for simplicity
RUN ng build --configuration production --output-path=dist

# Debug: verify build
RUN ls -R dist

# -----------------------------
# Stage 2: Serve with Nginx
# -----------------------------
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/browser /usr/share/nginx/html

# Copy custom Nginx config for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
