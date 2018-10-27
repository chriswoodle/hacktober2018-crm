const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/account', (req, res) => {
    console.log(req.query.phoneNumber);
    if(!req.query.phoneNumber) return res.status(400).end();
    
    const phone = require('phone')(req.query.phoneNumber);
    console.log(phone);

    res.send(phone);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));