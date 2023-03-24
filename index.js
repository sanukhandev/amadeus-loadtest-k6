const express = require('express');
const app = express();
const Influx = require('influx');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const influx = new Influx.InfluxDB({
    host: 'influxdb',
    database: 'k6',
    schema: [
        {
            measurement: 'logs',
            fields: {
                type: Influx.FieldType.STRING,
                status: Influx.FieldType.INTEGER,
                duration: Influx.FieldType.INTEGER,
                payload: Influx.FieldType.STRING,
                response: Influx.FieldType.STRING,

            },
            tags: [
                'host'
            ]
        },
        {
            measurement: 'data',
            fields: {
                bookingReferenceNumber: Influx.FieldType.STRING,
                bookingId: Influx.FieldType.STRING,
                pnr: Influx.FieldType.STRING,
            },
            tags: [
                'host'
            ]
        }
    ]
});

// Define API route that writes data to InfluxDB
app.post('/api/write-data-to-influx', async (req, res) => {
    const { type, status, duration, payload, response} = req.body;

    console.log('Writing data to InfluxDB...');
    try {
        const result = await influx.writePoints([
            {
                measurement: 'logs',
                tags: { host: 'k6_service' },
                fields: { type, status, duration, payload, response }
            }
        ]);
        res.response = result;
        res.sendStatus(200);
        console.log('Data written to InfluxDB');
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Write ticket and pnr data to InfluxDB
app.post('/api/write-ticket-pnr-data-to-influx', async (req, res) => {
    const { bookingId, pnr,ticketNumber, status } = req.body;

    console.log('Writing data to PNR InfluxDB...');
    try {
        const result = await influx.writePoints([
            {
                measurement: 'data',
                tags: { host: 'k6_service' },
                fields: { bookingId, pnr,ticketNumber}

            }])
        res.response = result;
        res.sendStatus(200);
        console.log('Data written to InfluxDB');
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

});

app.listen(8080, () => console.log('App listening on port 8080!'));
