# Build stage
FROM node:20-alpine AS build
WORKDIR /app
# Copy root package.json (workspace)
COPY package*.json ./
# Copy tsconfig.base.json
COPY tsconfig.base.json ./
# Copy frontend package.json
COPY frontend/package*.json ./frontend/
RUN npm install
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm run build

# Production stage
FROM nginx:alpine
COPY frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/frontend/dist/ /usr/share/nginx/html/
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
