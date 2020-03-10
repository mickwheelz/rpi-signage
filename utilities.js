var fs = require("fs");
var cp = require("child_process");

let procMap = [];
let config = {};

function execCommand(name, command, args) {
    console.log(command);
    let proc = cp.spawn(command, args);
    proc.on('exit', function (code, signal) {
        console.log('child process exited with ' + `code ${code} and signal ${signal}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
    });

    procMap.push({
        name: name,
        process: proc
    });
}

function setHostname(hostname) {
    //check hostname first
    //set
    //reboot
}

module.exports.refreshDisplay = function refreshDisplay() {
    execCommand('refresh', './refresh-browser.sh', []);
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
        execCommand('chrome', './chrome.sh', [config.webURL]);
        if(config.webAutoRefresh !== 0) {
            setInterval(function () { 
                //press 'F5' every x seconds
                this.refreshDisplay();
            }, config.webAutoRefresh); 
        }
    }
    if(config.mode === "slideshow") {
        console.log('slideshow mode');

        if(config.slideshowURLType !== "local") {
            // mount the network path to /media/slideshow
            execCommand('mount-network', './mount-network.sh', [config.slideshowURLType, config.slideshowURL]);
            //run the slideshow
            execCommand('slideshow', './slideshow.sh', ['/media/slideshow', config.slideTimeout]);
        }
        else {
            //run the slideshow
            execCommand('slideshow', './slideshow.sh', [config.slideshowURL, config.slideTimeout]);
        }
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
    });
}
