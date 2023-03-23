# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the container
COPY . .

# Set the environment variable for the InfluxDB URL
ENV INFLUXDB_URL=http://influxdb:8086/k6

# Expose the port that the app listens on
EXPOSE 8080

# Start the app
CMD [ "npm", "start" ]
