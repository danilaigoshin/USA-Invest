const axios = require('axios');
const cron = require('node-cron');
const axiosRetry = require('axios-retry');
 
axiosRetry(axios, { retries: 3 });

const req = async () => {
    await axios.post('http://usa-invest.ru/api/stocks/healthcare');
    await axios.post('http://usa-invest.ru/api/stocks/communicationservices');
    await axios.post('http://usa-invest.ru/api/stocks/technology');
    await axios.post('http://usa-invest.ru/api/stocks/financial');
    await axios.post('http://usa-invest.ru/api/stocks/industrials');

    await axios.post('http://usa-invest.ru/api/stocks/growrecommendations');
    await axios.post('http://usa-invest.ru/api/stocks/dividends');
    await axios.post('http://usa-invest.ru/api/stocks/biotech');
}

cron.schedule('* */8 * * *', () => {
    req();
});

console.log('started');
