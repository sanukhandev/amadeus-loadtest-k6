const baseUrl = __ENV.BASE_URL

const authUrl = `${baseUrl}/auth/authenticate`;
const offerUrl = `${baseUrl}/offer`;
const orderUrl = `${baseUrl}/order`;

const getUser = () => ({
    userId: __ENV.USER_ID,
    password: __ENV.USER_PASSWORD,
})

const orgId = __ENV.ORG_ID


const getK6Config = () => ({
    stages: [
        {duration: '1m', target: 50},
        {duration: '3m', target: 50},
        {duration: '1m', target: 10}
    ],

})

const getInfluxDB = () => ({
    url: __ENV.INFLUXDB_URL,
})

export const config = {
    baseUrl,
    authUrl,
    offerUrl,
    orderUrl,
    getUser,
    getK6Config,
    getInfluxDB,
    orgId
}
