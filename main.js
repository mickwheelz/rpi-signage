var utilities = require('./utilities.js');
var server = require('./server.js');

let config = {};

function init() {
    console.log('Init!');
    console.log('Reading Config!');
    let readConfig = utilities.readConfigFromDisk('config.json');
    readConfig.then(res => {
        console.log('Applying Config!');
        utilities.applyConfig(res);
    });
}

init();