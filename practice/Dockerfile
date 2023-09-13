# Use a base image
FROM node:14

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install node_moludes
RUN npm install

# Copy the entire code to the /app folder in the container
COPY . .

# Open the port on which the application works
EXPOSE 3000

# Launch the application when the container is started
CMD ["npm", "start"]
