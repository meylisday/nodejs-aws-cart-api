# Use the official Node.js version 18 image as the base image
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy all the application files to the container
COPY . .

# Build the Nest.js application
RUN npm run build

# Use a smaller, production-ready image as the base image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the previous build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

# Install only production dependencies to reduce image size
RUN npm install --production

# Expose the port on which your Nest.js application runs
EXPOSE 3000

# Set the command to start your Nest.js application
CMD ["node", "dist/main.js"]