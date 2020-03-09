var express = require('express');
var app = express();
var utilities = require('./utilities.js');

app.post('/setConfig', function (req, res) {
    fs.writeFile('config.json', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        console.log('Saved!');
        utilities.init();
    });
    
})

app.get('/getConfig', function (req, res) {
    let readPromise = utilities.readConfigFromDisk('config.json');
    readPromise.then(data => {
        res.end(data);
    });
})

app.get('/getSysInfo', function (req, res) {
    utilities.init();
    res.end('TODO:this');
})

app.get('/refreshDisplay', function (req, res) {
    res.end('TODO:this');
})

var server = app.listen(3000, function () {
    console.log("Server Running!")
})

module.exports = server;