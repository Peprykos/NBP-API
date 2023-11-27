const axios = require('axios');
const express = require('express');

const app = express();

let timestamp = null;
let nbp_data = null;
function kurs() {
    if ((Date.now() - timestamp) >= 300000) {
        axios.get('https://api.nbp.pl/api/exchangerates/tables/a?format=json')
        .then(response => {
            let data = response.data[0].rates;
            let filtered_data = data.filter((item) => {
                return item.code == 'USD' || item.code == 'EUR' || item.code == 'GBP';
            });
            timestamp = Date.now();
            nbp_data = filtered_data;
        })
        .catch(error => {
            console.log(error);
            process.exit(1);
        });
    }
}
kurs();

app.get('/dolar', (req, res) => {
    kurs();
    res.json(nbp_data[0].mid);
});

app.get('/euro', (req, res) => {
    kurs();
    res.json(nbp_data[1].mid);
});

app.get('/funt', (req, res) => {
    kurs();
    res.json(nbp_data[2].mid);
});


app.listen(5000, () => {
    console.log('Server started on port 5000');
});