var fs = require('fs');
var path = require('path');

if (process.platform === 'linux') {
    fs.chmodSync(path.join(__dirname, '..', 'bin', 'winexe_x64'), 777);
}
