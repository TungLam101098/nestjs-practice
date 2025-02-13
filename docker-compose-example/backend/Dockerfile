# syntax=docker/dockerfile:1.4

# Base stage for common setup
FROM node:lts-buster-slim AS base
WORKDIR /usr/src/app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM development AS build
RUN npm run build

# TODO: Using typescript to build the project
# Production stage
FROM base AS production
RUN npm install --only=production
# COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start"]
