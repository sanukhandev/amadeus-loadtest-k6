import Chance from 'https://cdn.skypack.dev/chance';
import moment from 'https://cdn.skypack.dev/moment';

const chance = new Chance();

export const lowFarePayload= (tripType, paxCount) => {

    let payload = {
        TripType: tripType+'',
        Adults: paxCount+'',
        Children: '0',
        Infants: '0',
        Itineraries: getItenerary(tripType),
        LangCode: 'EN',
        AirlineCode: chance.pickone(['EK', 'EY', 'QR', 'BA']),
        IsDirectFlight: false,
        IsBaggageOnly: false,
        Refundable: false,
        TargetCurrency: 'AED'
    }

    return JSON.stringify(payload);
}
export const brandedFarePayload = (sessionId) => {
    let payload = {
        sid: sessionId,
        flightOption: [
            {
                Type : "C",
                Id: "1"
            }
        ]
    }
    return JSON.stringify(payload);
}
export const pricingPayload = (sessionId, tokenId, foKey) => {
    let payload = {
        SessionId: sessionId,
        Token: tokenId,
        flightOption: [
            {
                Type: 'C',
                key: foKey,
            }
        ]
    }
    return JSON.stringify(payload);
}
export const orderPayload = (sessionId, tokenId, foKey, paxCount) => {
    let payload = {
        SessionId: sessionId,
        payment_mode: "WALLET",
        order: [
            {
                orderFareOption: [
                    {
                        key: foKey,
                        type: "C"
                    }
                ],
                token: tokenId,
                passengerDetails: generateCustomers(paxCount),
                clientDetails: {
                    EmailAddress: "shahzad.infohybrid@gmail.com",
                    MobileNo: 1234567890,
                    UserId: "2211071148167637488",
                    CountryCode: "376",
                    ISOCode: "IN",
                }
            }
        ]
    }

    return JSON.stringify(payload);
}

export const reConfirmPayload = (sessionId, bookindId) => {
    let payload = {
        SessionId : sessionId,
        payment_mode: "WALLET",
        Order :[
            {
                BookingID : bookindId
            }
        ]
    }
    return JSON.stringify(payload);
}




const generateCustomer = () => {
    const title = chance.pickone(['Mr', 'Mrs', 'Miss']);
    const firstName = chance.first();
    const middleName = chance.first();
    const lastName = chance.last();
    const dob = formatDate(chance.birthday({  year: 1980 }));
    const gender = chance.gender();
    const docType = chance.pickone(['Passport']);
    const docNumber = chance.string({ length: 9, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' });
    const docIssuingCountry = chance.country({ full: true });
    const nationality = chance.country({ full: true });
    const docIssueDate = formatDate(chance.date({  year: 2015 }));
    const docExpiryDate = formatDate(chance.date({ year: 2030 }));

    return {
        PassengerType: 'Adult',
        Title: title,
        FirstName: firstName,
        MiddleName: middleName,
        LastName: lastName,
        DateOfBirth: dob,
        Gender: gender,
        FormofIdentityNumber: '',
        Document: [
            {
                DocumentType: docType,
                DocumentNumber: docNumber,
                DocumentIssuingCountry: docIssuingCountry,
                Nationality: nationality,
                DocumentIssueDate: docIssueDate,
                DocumentExpiryDate: docExpiryDate,
            },
        ],
    };
};

const formatDate = (date) => {
    return moment(date).format('DD MMM YYYY');
}

const generateCustomers = (count) => {
    const customers = [];
    for (let i = 0; i < count; i++) {
        customers.push(generateCustomer());
    }
    return customers;
};


const getItenerary = (tripType = 1) => {
    const itinerary = [
        {
            DepartureCode: chance.pickone(['BOM', 'DEL', 'BLR', 'MAA']),
            ArrivalCode: chance.pickone(['DXB', 'AUH', 'DOH', 'SIN', 'KUL']),
            DepartureDate: chance.date({ year: 2023 }).toLocaleDateString(),
            Ticketclass: 'Y',
        },
        {
            DepartureCode: chance.pickone(['DXB', 'AUH', 'DOH', 'SIN', 'KUL']),
            ArrivalCode: chance.pickone(['LON', 'NYC', 'PAR', 'MAD', 'ROM']),
            DepartureDate: chance.date({ year: 2023 }).toLocaleDateString(),
            Ticketclass: 'Y',
        },
        {
            DepartureCode: chance.pickone(['LON', 'NYC', 'PAR', 'MAD', 'ROM']),
            ArrivalCode: chance.pickone(['BOM', 'DEL', 'BLR', 'MAA']),
            DepartureDate: chance.date({ year: 2023 }).toLocaleDateString(),
            Ticketclass: 'Y',
        },
    ];
    return itinerary.slice(0, tripType);
}


