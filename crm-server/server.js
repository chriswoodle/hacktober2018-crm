var request = require('request');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const port = 3000;

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const data = [{ "coordinates": [-96.7539681, 32.9909167], "name": "network issue", "class": "LL5", "mass": "500", "year": 2018 }];

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/data', (req, res) => res.send(data));


app.get('/account', (req, res) => {
    console.log(req.query.phoneNumber);
    if (!req.query.phoneNumber) return res.status(400).end();

    const phone = require('phone')(req.query.phoneNumber);
    console.log(phone);

    res.send(phone);
});

app.post('/assist', (req, res) => {
    console.log('/assist')
    console.log(req.body)


    var options = {
        uri: 'http://49fec1fc.ngrok.io/sentiment',
        method: 'POST',
        json: {
            "current_input": req.body.current_input || req.body.CurrentInput
        }
    };

    request(options, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        io.emit('assist', {
            score: body.score,
            magnitude: body.magnitude,
            type: req.body.current_task || req.body.CurrentTask,
            input: req.body.current_input || req.body.CurrentInput,
            giphyurl: body.giphyUrl,
            entities: JSON.parse(body.entities).map(item => item.name)
        });
        data.push({ "coordinates": [-96.7539681, 32.9909167], "name": "network issue", "class": "LL5", "mass": "500", "year": 2018 });
    });

    res.send({
        "actions": [
            {
                "say": "Your Report has been recorded. A customer service agent will contact you shortly. Thank you."
            },
            {
                "listen": true
            }
        ]
    });
});

const sockets = [];

io.on('connection', function (socket) {
    sockets.push(socket);
    console.log('socket connected')
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });

    socket.on('client', function (number) {
        console.log(number);
        const phone = require('phone')(number)[0];
        console.log(phone);
        if (phone == '+17274590222') {
            console.log('sending profile');
            const profile = {
                fullName: 'Chris Woodle',
                email: 'chriswoodle@outlook.com',
                image: 'https://en.gravatar.com/userimage/113993408/3930a94c8b91977da5ad1eb059a5c0eb.jpeg'
            }
            io.emit('profile', profile);
        } else {
            io.emit('profile', {});
        }
    });
    socket.on('disconnect', () => {
        // delete sockets[socket];
    })
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));