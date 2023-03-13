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

export default {
    lowFarePayload
}
