var fs = require("fs");
var cp = require("child_process");

function execCommand(command) {
    console.log(command);
    cp.spawn(command,function(error,stdout,stderr){
        if(error || stderr) {
            let errorString = error ? error : stderr;
            throw "Error " + errorString;
        }
        else {
            console.log(stdout);
        }
    })
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

    if(config.mode === "web") {
        console.log('web mode');
        let chromeCommand = 'DISPLAY=:0 chromium-browser';
        execCommand(chromeCommand);
       // proc.kill();
    }
    if(config.mode === "slideshow") {
        console.log('slideshow mode');
        //do slideshow
        //run slideshow app with given filepath
    }
};