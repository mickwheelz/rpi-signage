var fs = require("fs");
var cp = require("child_process");

function execCommand(command, args) {
    console.log(command);
    let proc = cp.spawn(command, args);

    proc.on('exit', function (code, signal) {
        console.log('child process exited with ' + `code ${code} and signal ${signal}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
    });
}

function setHostname(hostname) {
    //check hostname first
    //set
    //reboot
}

function refreshDisplay() {
    //TODO: This
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
};

module.exports.applyConfig = function applyConfig(c) {
    config = JSON.parse(c);
    console.log(config);

    if(config.mode === "web") {
        console.log('web mode');
        let chromeCommand = './chrome.sh';
        execCommand(chromeCommand, [config.webURL]);
       // proc.kill();
    }
    if(config.mode === "slideshow") {
        console.log('slideshow mode');
        //do slideshow
        //run slideshow app with given filepath
    }
};