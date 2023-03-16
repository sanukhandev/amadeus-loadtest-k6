export const lowFarePayload= () => {
    let payload = {
        TripType: '3',
        Adults: '1',
        Children: '0',
        Infants: '0',
        Itineraries: [
            {
                DepartureCode: 'BOM',
                ArrivalCode: 'DXB',
                DepartureDate: '25 Mar 2023',
                Ticketclass: 'Y'
            },
            {
                DepartureCode: 'DXB',
                ArrivalCode: 'LON',
                DepartureDate: '25 Apr 2023',
                Ticketclass: 'Y'
            },
            {
                DepartureCode: 'LON',
                ArrivalCode: 'BOM',
                DepartureDate: '10 May 2023',
                Ticketclass: 'Y'
            }
        ],
        LangCode: 'EN',
        AirlineCode: 'EK',
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
export const orderPayload = (sessionId, tokenId, foKey) => {
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
                passengerDetails: [
                    {
                        PassengerType: "Adult",
                        Title: "Mr",
                        FirstName: "Sanu",
                        MiddleName: "",
                        LastName: "Khan",
                        DateOfBirth: "24 Sep 1993",
                        Gender: "male",
                        FormofIdentityNumber: "",
                        Document: [
                            {
                                DocumentType: "Passport",
                                DocumentNumber: "SX1234567",
                                DocumentIssuingCountry: "IN",
                                Nationality: "IN",
                                DocumentIssueDate: "06 Sep 2019",
                                DocumentExpiryDate: "06 Sep 2029"
                            }
                        ]
                    }
                ],
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

