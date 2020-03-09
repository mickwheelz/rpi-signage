var express = require('express');
var app = express();

app.post('/setConfig', function (req, res) {
    fs.writeFile('config.json', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})

app.get('/getConfig', function (req, res) {
    let readPromise = utilities.readConfigFromDisk('config.json');
    readPromise.then(data => {
        res.end( JSON.stringify(data) );
    });
})

app.get('/getSysInfo', function (req, res) {
    res.end('TODO:this');
})

app.get('/refreshDisplay', function (req, res) {
    res.end('TODO:this');
})

var server = app.listen(3000, function () {
    console.log("Server Running!")
})

module.exports = server;