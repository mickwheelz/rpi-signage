var express = require('express');
var app = express();
var utilities = require('./utilities.js');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/setConfig', function (req, res) {
    console.log(req.body);
    utilities.writeConfigToDisk(req.body, 'config.json');
    utilities.init();
    res.send('Success!');
})

app.get('/getConfig', function (req, res) {
    let readPromise = utilities.readConfigFromDisk('config.json');
    readPromise.then(data => {
        res.end(data);
    });
})

app.get('/getSysInfo', function (req, res) {
    res.sendStatus(200);
    res.end('TODO:this');
})

app.get('/reInit', function (req, res) {
    utilities.init();
    res.sendStatus(200);
    res.end('reinit successful');
})

app.get('/refreshDisplay', function (req, res) {
    utilities.refreshDisplay();
    res.sendStatus(200);
    res.end('refresh successful');
})

var server = app.listen(3000, function () {
    console.log("Server Running!")
})

module.exports = server;