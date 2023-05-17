import http from 'k6/http';
import {Counter, Rate} from 'k6/metrics';
import {check} from 'k6';
import {config} from './Config.js';

import {brandedFarePayload, lowFarePayload, orderPayload, pricingPayload, reConfirmPayload} from './BoilerPlate.js';


let token, headers;
// Error counters
const errorRate = new Rate('error_rate');
const successRate = new Rate('success_rate');
const lowFareErrorRate = new Rate('low_fare_error_rate');
const lowFareSuccessRate = new Rate('low_fare_success_rate');
const brandedFareErrorRate = new Rate('branded_fare_error_rate');
const brandedFareSuccessRate = new Rate('branded_fare_success_rate');
const pricingErrorRate = new Rate('pricing_error_rate');
const pricingSuccessRate = new Rate('pricing_success_rate');
const orderErrorRate = new Rate('order_error_rate');
const orderSuccessRate = new Rate('order_success_rate');
const issueErrorRate = new Rate('issue_error_rate');
const issueSuccessRate = new Rate('issue_success_rate');
const reConfirmErrorRate = new Rate('re_confirm_error_rate');
const reConfirmSuccessRate = new Rate('re_confirm_success_rate');
// Counters
const lowFareCounter = new Counter('low_fare_counter');
const brandedFareCounter = new Counter('branded_fare_counter');
const pricingCounter = new Counter('pricing_counter');
const orderCounter = new Counter('order_counter');
const issueCounter = new Counter('issue_counter');
const reConfirmCounter = new Counter('re_confirm_counter');
// Trend
// TODO: Add trend for all the calls

const measurements = {
    logs: `write-data-to-influx`,
    data: `write-ticket-pnr-data-to-influx`
}





const auth = () => {
    const authResponse = http.post(config.authUrl, '', {
        headers: config.getUser()
    });
    if (authResponse.status !== 200) {
        console.log("Auth failed: " + authResponse.status)
        return false;
    }
    console.log("Auth successful: " + authResponse.status)
    token = JSON.parse(authResponse.body).token;
}
const getHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    orgId: `${config.orgId}`,
    'Content-Type': 'application/json',
})



async function writeResponseToInflux(data, measurement = 'logs') {
   http.post(`http://my-node-app:8080/api/${measurements[measurement]}`, JSON.stringify(data),{
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

const postApi = (url, payload, type = 'Default post call') => {
    const response = http.post(url, payload, {
        headers
    });
    check(response, {
        [`${type}  has response`]: (r) => r.status === 200,
    });
    const data = {
        type,
        status: response.status,
        duration: response.timings.duration,
        timestamp: new Date().toISOString(),
        payload,
        response: response.body,
    }
    writeResponseToInflux(data).then(r => console.log("Response written to influx"));
    if (response.status !== 200) {
        errorRate.add(1);
        return false;
    }
    successRate.add(1);
    return response;
}

const parseBrandedFareResponse = (response) => {
    let tokenId, flightOptionKey;
    const body = JSON.parse(response.body);
    if (body && body['flightSummary'] && body['flightSummary'].length > 0) {
        tokenId = body['tokenId'];
        flightOptionKey = body['flightSummary'][0]['flightOptions']['fo'][0]['key'];
    }
    return {tokenId, flightOptionKey};
}


export default function () {
    // Step 1: Auth
    if (!token && !headers) {
        auth();
        headers = getHeaders(token);
    }
    const paxCount = 1;
    const tripType = 1;
    // Step 2: Low Fare
    const lowFareResponse = postApi(`${config.offerUrl}/lowfare`, lowFarePayload(tripType, paxCount), 'Low Fare');
    const sessionId = JSON.parse(lowFareResponse.body)['sessionId'];
    lowFareCounter.add(1);
    if (!sessionId) {
        lowFareErrorRate.add(1);
        console.log("Session ID not found")
        return;
    }
    lowFareSuccessRate.add(1);
    // Step 3: Branded Fare
    const brandedFareResponse = postApi(`${config.offerUrl}/brandedfare`, brandedFarePayload(sessionId), 'Branded Fare');
    brandedFareCounter.add(1);
    if (!brandedFareResponse) {
        brandedFareErrorRate.add(1);
        console.log("Branded Fare failed")
        return;
    }
    brandedFareSuccessRate.add(1);
    const {tokenId, flightOptionKey} = parseBrandedFareResponse(brandedFareResponse);
    if (!tokenId && !flightOptionKey) {
        console.log("Token ID not found")
        return;
    }
    // Step 4: Pricing
    const pricingResponse = postApi(`${config.offerUrl}/pricing`, pricingPayload(sessionId, tokenId, flightOptionKey), 'Pricing');
    pricingCounter.add(1);
    if (!pricingResponse) {
        pricingErrorRate.add(1);
        console.log("Pricing failed")
        return;
    }
    pricingSuccessRate.add(1);
    // Step 5: Order
    const createOrderResponse = postApi(`${config.orderUrl}/create-order`, orderPayload(sessionId, tokenId, flightOptionKey, paxCount), 'Order');
    orderCounter.add(1);
    if (!createOrderResponse) {
        orderErrorRate.add(1);
        console.log("Order failed")
        return;
    }
    orderSuccessRate.add(1);
    const {result, hasResult} = JSON.parse(createOrderResponse.body)
    if (!hasResult) {
        console.log("Booking Reference Number not found")
        return;
    }
    const bookingReferenceNumber = result['bookingReferenceNumber'];
    const bookingId = result['bookingID'];
    const PNR = result['pnrDetailRs'].map(x => x['pnrNumber']).join(',');

    const data = {
        bookingReferenceNumber,
        bookingId,
        PNR,
    }
    writeResponseToInflux(data, 'data').then(r => console.log("Response written to influx"));


    // Step 6: Order Issue
    const orderIssueResponse = postApi(`${config.orderUrl}/issue`, reConfirmPayload(sessionId, bookingReferenceNumber), 'Order Issue');
    issueCounter.add(1);
    if (!orderIssueResponse) {
        issueErrorRate.add(1);
        console.log("Order Issue failed")
        return;
    }


    issueSuccessRate.add(1);
    // Step 7: Order Reconfirm
    const orderReConfirmResponse = postApi(`${config.orderUrl}/re-confirm`, reConfirmPayload(sessionId, bookingReferenceNumber), 'Order Reconfirm');
    reConfirmCounter.add(1);
    if (!orderReConfirmResponse) {
        reConfirmErrorRate.add(1);
        console.log("Order Reconfirm failed")
        return;
    }
    reConfirmSuccessRate.add(1);
    check(orderReConfirmResponse, {
        'Order Reconfirm has response': (r) => r.status === 200,
        'Order Reconfirm has bookingReferenceNumber': (r) => JSON.parse(r.body)['bookingReferenceNumber'] !== '',
    });
}


export let options = config.getK6Config();


