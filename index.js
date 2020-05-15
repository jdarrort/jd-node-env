var fs = require('fs');
var path = require('path');

const SECRET_PATH = '/run/secrets';

// To handle SubFolder defined creds
function getSecrets(in_dir){
    let relative_path = in_dir? path.join(SECRET_PATH, in_dir) : SECRET_PATH;
    let secrets= {};
    fs.readdirSync( relative_path )
    .forEach( f => {
        if (fs.lstatSync(path.join(relative_path, f)).isDirectory()){
            secrets = Object.assign(secrets, getSecrets(f));
        } else {
            secrets[f] = fs.readFileSync(path.join(relative_path, f)).toString('utf-8').trim();
        }
    });
    return secrets;
}

let secrets={};
try {
    secrets = getSecrets();
    Object.keys(secrets).forEach( s => {
        if (! process.env[s]) { process.env[s] = secrets[s];}
    });
} catch(e) {
    console.warn("Failed to get secrets ");
}