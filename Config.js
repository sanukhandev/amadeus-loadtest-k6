const baseUrl = __ENV.BASE_URL

const authUrl = `${baseUrl}/auth/authenticate`;
const offerUrl = `${baseUrl}/offer/lowfare`;

const getUser = () => ({
    userId: __ENV.USER_ID,
    password: __ENV.USER_PASSWORD,
})

const orgId = __ENV.ORG_ID


const getK6Config = () => ({
    stages: [
        {duration: '1m', target: 100},
        {duration: '3m', target: 100},
        {duration: '1m', target: 0}
    ],

})

export const config = {
    baseUrl,
    authUrl,
    offerUrl,
    getUser,
    getK6Config,
    orgId
}
