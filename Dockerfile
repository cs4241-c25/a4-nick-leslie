# Use the official Node.js image as a base
FROM node:20 as base

# Set the working directory in the container
WORKDIR /app

FROM base as build

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

#build frountend
RUN ./build.sh

FROM base

COPY --from=build /app /app

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node" ,"server.js"]
