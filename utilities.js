const fs = require("fs");
const cp = require("child_process");
const request = require('request')
const internalIp = require('internal-ip');

let procMap = new Map();
let config = {};

function execCommand(name, command, args) {
    console.log(`Command ${command} run with args ${args}`);

    let proc = cp.spawn(command, args);

    proc.on('exit', function (code, signal) {
        console.log('child process exited with ' + `code ${code} and signal ${signal}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
    });

    procMap.set(name, proc);
}

function setHostname(hostname) {
    //check hostname first
    //set
    //reboot
}

function callManagemntServer(config) {
    request.post(config.managementServer, {
        json: {
            name: config.hostname,
            address: internalIp.v4.sync()
        }
    }, (err, res, body) => {
        if (err) {
            throw err
        }
        console.log(`statusCode: ${res.statusCode}`)
        console.log(body)
    })
}

module.exports.refreshDisplay = function refreshDisplay() {
    execCommand('refresh', 'xdotool', ['key F5']);
}

module.exports.readConfigFromDisk = function readConfigFromDisk(configFileName) {
    return new Promise(function(resolve, reject){
        fs.readFile(configFileName, 'utf8', function (err, data) {
            if (err) {
                reject (err);
            }
            resolve(data);
        });
     })
}

module.exports.applyConfig = function applyConfig(c) {
    config = JSON.parse(c);

    if(config.mode === "web") {
        console.log('web mode');
        
        //open chrome in kiosk mode to given URL
        execCommand('chrome', 'chromium-browser', ['--kiosk', `--app=${config.webURL}`]);

        if(config.webAutoRefresh !== 0) {
            setInterval(function () { 
                //press 'F5' every x seconds
                this.refreshDisplay();
            }, config.webAutoRefresh); 
        }
    }
    if(config.mode === "slideshow") {
        console.log('slideshow mode');

        // mount the network path to /media/slideshow
        if(config.slideshowURLType !== "local") {
            //execCommand('mount-network', './mount-network.sh', [config.slideshowURLType, config.slideshowURL]);
        }
        execCommand('slideshow', 'slide', [`-p ${config.slideshowURL}`, `-t ${config.slideTimeout}`]);

    }
}

module.exports.writeConfigToDisk = function writeConfigToDisk(config, configFileName) {
    fs.writeFile(configFileName, JSON.stringify(config), function (err) {
        if (err) throw err;
        console.log('Saved! to ' + configFileName);
    });
}

module.exports.init = function init() {

    if(procMap) {
        procMap.forEach(pr => {
            console.log(pr.name);
            pr.process.kill();
        });
    }

    let readConfig = this.readConfigFromDisk('config.json');
    
    readConfig.then(res => {
        console.log('Applying Config!');
        this.applyConfig(res);
        callManagemntServer(config);
    });
}
