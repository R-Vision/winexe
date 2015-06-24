'use strict';

var WinExe = require('../');

var winexe = new WinExe({
    username: null,
    password: null,
    host: '127.0.0.1'
});

winexe.run('ipconfig /all', function (err, result) {
    console.log(err || result);
});
