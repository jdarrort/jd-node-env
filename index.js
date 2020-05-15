var fs = require('fs');
var path = require('path');

const SECRET_PATH = '/run/secrets';
try {
    fs.readdirSync( SECRET_PATH )
    .forEach( f => {
        if (typeof process.env[f] === "undefined") { 
            process.env[f] = fs.readFileSync(path.join(SECRET_PATH, f)).trim(); 
        }
    });
} catch(e) {
    console.warn("Failed to get secrets ");
}
