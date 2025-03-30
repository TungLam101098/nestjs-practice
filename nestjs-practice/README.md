# NestJS Food Delivery Application

## Overview

This repository contains a food delivery application built with NestJS.

## Technical Requirements

- Docker for multi-environment deployment (Dev, Prod)

## Core Dependencies

- Node.js >= v22.14.0
- NestJS v11
- PostgreSQL v16.2
- Jest for unit testing

## Access Control

The application implements role-based access control:

| Role  | Permissions                                  |
| ----- | -------------------------------------------- |
| Admin | Can view create food and get all orders      |
| User  | Can view foods, create cart and place orders |

## Features

### User Management

- Admin: System management and analytics
- User: Browse food items, create cart and place orders

### Food Management

- Create a food with details (name, description, price, etc.)
- Get all foods or food item
- Update and delete a food by id

### Order Management

- Create and place orders
- Calculate total amount

### Cart Management

- Create a cart
- Get all cart with Admin role

## Entity Relationship Diagram

- [Relationship diagram](https://drive.google.com/file/d/1ILa2pKbZkwfnurDSeul95QYBgjZTPzeU/view?usp=sharing)

## Getting Started

### Installation

```bash
# Clone the repository
git clone -b develop git@gitlab.asoft-python.com:lam.nguyen/nodejs-training.git

# Navigate to the project directory
cd nodejs-training/nestjs-practice/
```

### Environment Setup

The application uses NODE_ENV to determine which environment configuration to load

```bash
# Copy example environment file
cp .env.example .env

# Update the environment variables
```

### Running with Docker

This method handles all dependencies and database setup automatically:

```bash
# Navigate to docker directory
cd docker

# Start development environment
npm run docker:dev

# Start production environment
npm run docker:prod

# To stop the services
docker compose down
```

### API Documentation

The API documentation is available through Swagger UI. After starting the application, you can access it at:

```
http://localhost:8080/api-doc
```

This documentation includes:
- All available endpoints
- Request/Response schemas
- Authentication requirements
- Test endpoints directly from the browser

### Running Tests

```bash
# Run unit tests
npm run test

# Run test coverage
npm run test:cov
```

## Timeline

- Development timeline: 6 days

## Notes

### Package Updates

When you update package versions or add new packages in `package.json`, you need to rebuild the Docker containers:

```bash
# Stop running containers
docker compose down

# Rebuild and start development containers
npm run docker:dev

# Or rebuild and start production containers
npm run docker:prod
```

### Git Commit Rules

When creating commits or merge requests, you must include the GitLab issue tag in your message:

```bash
# Commit format
git commit -m "#[issue-id] your commit message"

# Examples
git commit -m "#123 Add user authentication"
git commit -m "#456 Fix menu pagination bug"
```
