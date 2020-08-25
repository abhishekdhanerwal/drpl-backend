const axios = require("axios");
const { URLSearchParams } = require('url')

const apiKey = "AznhAjn/VgI-X6jxKAAMYXuwDy9t10kXFKWaLTKtQn" // YOUR API KEY HERE
const baseURL = "http://api.textlocal.in"

const smsClient = {
    sendPartnerWelcomeMessage: (id, password, mobile) => {
        if (id && password && mobile) {
            const params = new URLSearchParams();
            params.append("apikey", apiKey);
            params.append("sender", "TXTLCL");
            params.append("numbers", mobile);
            params.append(
                "message",
                `Welcome to DRPL Family. Your id is - ${id} and your password is - ${password}.`
            );
            axios.get(baseURL + "/send/?" + params.toString()).then(res => { console.log(res.data) })
        }
    },
    sendVerificationMessage: contactNumber => {
        if (contactNumber) {
            const params = new URLSearchParams();
            params.append("apikey", apiKey);
            params.append("sender", "YOUR PARTNER KEY HERE"); // Please change you value here
            params.append("numbers", contactNumber);
            params.append(
                "message",
                `Your One Time Verification code is`
            );
            return axios.get(baseURL + "/otp_send/?" + params.toString())

        }
    },
    checkBalance: user => {
        axios.get(baseURL + "/balance").then(res => { console.log(res.data) })
    },

    validateVerificationMessage: user => {
        if (user && user.contactNumber) {
            const params = new URLSearchParams();
            params.append("apikey", apiKey);
            params.append("numbers", user.contactNumber);
            params.append("code", user.token);

            return axios.get(baseURL + "/otp_challenge/?" + params.toString())

        }
    }
};

module.exports = smsClient;