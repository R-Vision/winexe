var fs = require('fs');
var path = require('path');

if (process.platform === 'linux') {
    fs.chmodSync(path.join(__dirname, '..', 'bin', 'winexe_centos_x64'), 777);
    fs.chmodSync(path.join(__dirname, '..', 'bin', 'winexe_ubuntu_x64'), 777);
}
