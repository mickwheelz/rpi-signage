const cp = require("child_process");

let procMap = new Map();

function execCommand(name, command, args) {
    console.log(command);
    let proc = cp.spawn(command, args);
    proc.on('exit', function (code, signal) {
        console.log('child process exited with ' + `code ${code} and signal ${signal}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
    });

    procMap.set(name, proc);
}

function killProc(name) {
    
    procMap.get(name).kill();

}

function doStuff() {

    execCommand('test', './chrome.sh', []);

    setInterval(function () { 
        console.log('tried kill');
        killProc('test');
    }, 30000); 
}

doStuff();
