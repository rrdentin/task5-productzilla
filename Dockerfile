# Base stage
FROM node:18-alpine as base

WORKDIR /usr/src/app

# Development stage
FROM base as development
ENV NODE_ENV=development

# Copy package.json and package-lock.json first to take advantage of caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Command for development with nodemon
CMD ["npm", "run", "dev"]

# Production stage
FROM base as production
ENV NODE_ENV=production

# Copy only the package.json and package-lock.json for production
COPY package*.json ./
RUN npm ci --only=production

# Copy source code (exclude dev dependencies)
COPY . .

# Command to start the application
CMD ["npm", "start"]
