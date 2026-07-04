FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies for production
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the API port
EXPOSE 5001

# Command to run the application
CMD [ "node", "server.js" ]
