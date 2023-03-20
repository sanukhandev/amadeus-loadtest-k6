# K6 Load Testing Script with Docker Compose

This is a load testing script written in JavaScript for the [K6](https://k6.io/) load testing tool. It tests the performance of an API by sending requests to its endpoints.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup
1. Clone the repository
2. Update the `docker-compose.yml` file with the relevant environment variables for `BASE_URL`, `USER_ID`, `USER_PASSWORD`, and `ORG_ID`.
3. Run the `docker-compose` command to start the InfluxDB, Grafana, and K6 containers using the following command: `docker-compose up -d`
4. Access the Grafana dashboard at `http://localhost:3000` and configure the data source using the following settings:
    - Name: `K6`
    - Type: `InfluxDB`
    - URL: `http://influxdb:8086`
    - Database: `k6`
5. Import the K6 Dashboard provided by Grafana at `http://localhost:3000/dashboards` and select the `k6-grafana-dashboard.json` file from the cloned repository.

## Usage
The script sends requests to the following endpoints:
- `/lowfare`
- `/brandedfare`
- `/pricing`
- `/create-order`
- `/issue`
- `/re-confirm`

The script measures the success rate and error rate of each endpoint, and generates InfluxDB line protocol data that can be used to visualize the results in a dashboard.

The `docker-compose.yml` file defines the configuration for the InfluxDB, Grafana, and K6 containers. The K6 container is configured to use the InfluxDB database as the output and store the results in a CSV file.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
