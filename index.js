import http from 'k6/http';
import {check} from 'k6';
import {config} from './config.js';
import {lowFarePayload} from './BoilerPlate.js';


export let options = config.getK6Config();
const Shopping =  () => {
    // authenticate and get access token
    let authResponse = http.post(config.authUrl, '', {
        headers: config.getUser()
    });

    check(authResponse, {
        'Is Auth Response status is 200': (r) => r.status === 200
    });


    const token = JSON.parse(authResponse.body).token;
    const getHeaders = () => ({
        Authorization: `Bearer ${token}`,
        orgId: `${config.orgId}`,
        'Content-Type': 'application/json',
    })
// use access token to make API request
    let response = http.post(config.offerUrl, lowFarePayload(), {
        headers: getHeaders()
    });
    check(response, {
        'Lowfare Response status is 200': (r) => r.status === 200,
        'Lowfare Response body': (r) => r.body !== '',
        'Lowfare Response has SessionId': (r) => r.body['sessionId'] !== '',
        'Lowfare Response has Airlines': (r) => r.body['airlines'] !== '',
    });
}

export default function () {
    Shopping();
}
