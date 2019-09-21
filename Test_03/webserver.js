var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('pigpio').Gpio //include pigpio to interact with the GPIO
var sensor = require('node-dht-sensor')// support 11 & 22 type
var LCD = require('lcdi2c');

var lcd = new LCD(1, 0x27, 20, 4);
lcd.clear();

var LED = new Gpio(26, { mode: Gpio.OUTPUT }); //use GPIO pin 26 as output
var pushButton = new Gpio(19, { mode: Gpio.INPUT, edge: Gpio.EITHER_EDGE, alert: true }); //use GPIO pin 19 as input, and 'both' button presses, and releases should be handled

http.listen(8080); //listen to port 8080

function handler(req, res) { //create server
    fs.readFile(__dirname + '/public/index.html', function (err, data) { //read file index.html in public folder
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' }); //display 404 on error
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' }); //write HTML
        res.write(data); //write data from index.html
        return res.end();
    });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
    var lightvalue = 0; //static variable for current status

    pushButton.on('alert', (level, tick) => {
        lightvalue = level;
        socket.emit('light', lightvalue); //send button status to client
    });

    socket.on('line1', (data) => onLineChange(data, 1));

    socket.on('line2', (data) => onLineChange(data, 2));

    socket.on('light', function (data) { //get light switch status from client
        lightvalue = data;
        if (lightvalue != LED.digitalRead()) { //only change LED if status has changed
            LED.digitalWrite(lightvalue); //turn LED on or off
        }

        sensor.read(11, 17, function (err, temperature, humidity) {
            if (!err) {
                console.log(
                    'temp: ' + temperature.toFixed(1) + '°C, ' +
                    'humidity: ' + humidity.toFixed(1) + '%'
                );

                lcd.println('Temp.: ' + temperature.toFixed(1) + ' C', 1);
                lcd.println('Humi.: ' + humidity.toFixed(1) + '%', 2);
            }
        });
    });
});

function onLineChange(data, numLine) {
    lcd.println(data, numLine);
}

process.on('SIGINT', function () { //on ctrl+c
    LED.digitalWrite(0); // Turn LED off
    lcd.clear();
    process.exit(); //exit completely
});