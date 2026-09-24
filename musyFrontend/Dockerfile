# Stage 1: Build the frontend application
FROM node:20-alpine AS build
WORKDIR /app

# Accept build argument for backend URL (empty string defaults to relative /api routing)
ARG VITE_BACKEND_URL=""
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the Vite application with VITE_BACKEND_URL
RUN VITE_BACKEND_URL=$VITE_BACKEND_URL npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the build stage to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
