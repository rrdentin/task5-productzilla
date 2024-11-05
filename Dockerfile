# Base stage
FROM node:lts-buster AS base
WORKDIR /usr/src/app

# Development stage
FROM base AS development
ENV NODE_ENV=development

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Command for development
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the source code
COPY . .

# Command to start the application
CMD ["npm", "start"]

# Test stage
FROM development AS test
# Run tests
CMD ["npm", "run", "test"]
