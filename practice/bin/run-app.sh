#!/bin/bash

# Build application service
docker-compose -f docker/run-app.yml build

# Run application service
docker-compose -f docker/run-app.yml up
