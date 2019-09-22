import * as express from 'express'
import * as cors from 'cors'                                            // A node.js package that provides an Express/Connect middleware to enable Cross Origin Resource Sharing (CORS)
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as socketIO from 'socket.io';
import { Gpio } from 'pigpio';
import { LCD } from 'lcdi2c';   // node_modules/lcdi2c/lcdi2c.js ( change last line module.exports.LCD = LCD;)
var sensor = require('node-dht-sensor')// support 11 & 22 type

const lcd = new LCD(1, 0x27, 20, 4); lcd.clear();
const redLED = new Gpio(26, { mode: Gpio.OUTPUT }); //use GPIO pin 26 as output
const pushButton = new Gpio(19, { mode: Gpio.INPUT, edge: Gpio.EITHER_EDGE, alert: true }); //use GPIO pin 19 as input, and 'both' button presses, and releases should be handled
const SensorMouvement = new Gpio(16, { mode: Gpio.INPUT, edge: Gpio.EITHER_EDGE, alert: true }); //use GPIO pin 19 as input, and 'both' button presses, and releases should be handled

const app = express();

app.use(cors());
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Point static path to dist
app.use(express.static(path.join(__dirname, '.')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const server = app.listen(4200, function () {
    console.log('API : listening on port 4200!');
});

const io = socketIO(server);

io.on("connection", function (socket: any) {

    pushButton.on('alert', (level, tick) => {
        socket.emit('light', level); //send button status to client
    });

    SensorMouvement.on('alert', (level, tick) => {
        socket.emit('intrude');
    });

    socket.on('light', function (data) {
        // get light switch status from client -- only change LED if status has changed
        if (data != redLED.digitalRead()) {
            redLED.digitalWrite(data); //turn LED on or off
        }
    });

    socket.on('temperature-pression', function () {
        sensor.read(11, 17, function (err, temperature, humidity) {
            if (!err) {
                socket.emit(
                    'temperature-pression',
                    'temperature: ' + temperature.toFixed(1) + '°C, humidity: ' + humidity.toFixed(1) + '%');
            }
        });
    });

    socket.on('line1', (data) => onLineChange(data, 1));

    socket.on('line2', (data) => onLineChange(data, 2));
});

function onLineChange(data, numLine) {
    lcd.println('                    ', numLine);
    writeText(data, numLine);
}

function writeText(text = '', num_line = 1, num_cols = 16) {
    if (text.length > num_cols) {
        lcd.println(text.substr(0, num_cols), num_line);
        sleep(1000).then(() => {
            for (let i = 0; i <= text.length - num_cols; i++) {
                sleep(200).then(() => lcd.println(text.substring(i, i + num_cols), num_line));
            }
        });
    } else {
        lcd.println(text, num_line)
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

process.on('SIGINT', function () { //on ctrl+c
    redLED.digitalWrite(0); // Turn LED off
    lcd.clear();
    process.exit(); //exit completely
});
