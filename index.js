const express = require('express');
const app = express();
const Influx = require('influx');

// Set up InfluxDB connection

// type,
//     status: response.status,
//     duration: response.timings.duration,
//     timestamp: new Date().toISOString(),
//     payload: JSON.parse(payload),
//     response: JSON.parse(response.body),
// }
const influx = new Influx.InfluxDB({
    host: 'influxdb',
    database: 'k6',
    schema: [
        {
            measurement: 'data',
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
        }
    ]
});

// Define API route that writes data to InfluxDB
app.get('/api/write-data-to-influx', async (req, res) => {
    const { type, status, duration, payload, response} = req.body;

    try {
        await influx.writePoints([
            {
                measurement: 'data',
                tags: { host: 'k6_service' },
                fields: { type, status, duration, payload, response }
            }
        ]);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.listen(8080, () => console.log('App listening on port 3000'));
