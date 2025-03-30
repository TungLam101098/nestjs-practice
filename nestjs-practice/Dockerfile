# syntax=docker/dockerfile:1.4

# Base stage for common setup
FROM node:22.14.0-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM base AS production
RUN npm install
COPY --from=build /usr/src/app/dist ./dist
COPY src/scripts/migrations ./src/scripts/migrations
COPY src/config/typeorm.migration.config.ts ./src/config/

CMD ["node", "dist/src/main"]
