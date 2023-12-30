# Use an optimized node version `-alpine`
FROM node:lts-alpine

# Set working directory
WORKDIR /nodejs-aws-cart-api

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
# RUN npm ci --only=production
RUN npm install

# Bundling
COPY . .

# Building inside the container
RUN npm run build

# Expose port
EXPOSE 4000

# Execute on entry
ENTRYPOINT [ "node", "dist/main.js" ]