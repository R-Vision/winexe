'use strict';

var exec = require('child_process').exec;
var path = require('path');
var getUsername = require('./username.js');

function WinExe(options) {
    this.host = options.host;
    this.username = getUsername(options.username);
    this.password = options.password;
    this.isWindows = process.platform === 'win32';
    this.winexe = this.isWindows ? 'psexec.exe' : 'winexe';

    return this;
}

WinExe.prototype._getArgs = function () {
    return this.isWindows ? this._getArgsForPsExec() : this._getArgsForWinExe();
};

WinExe.prototype._getArgsForWinExe = function () {
    var args = [];

    if (this.username) {
        if (this.password) {
            args.push('--user=' + this.username + '%' + this.password);
        } else {
            args.push('--user=' + this.username);
        }
    }

    if (!this.password) {
        args.push('--no-pass');
    }

    args.push('//' + this.host, '"' + this.cmd + '"');

    return args;
};

WinExe.prototype._getArgsForPsExec = function () {
    var args = [
        '\\\\' + this.host
    ];

    if (this.username) {
        args.push('--u', '"' + this.username + '"');
    }

    if (this.password) {
        args.push('--p', '"' + this.password + '"');
    }

    args.push('-accepteula', this.cmd);

    return args;
};

WinExe.prototype._getExecCommand = function () {
    var args = this._getArgs();
    args.unshift(this.winexe);
    return args.join(' ');
};

WinExe.prototype._exec = function (callback) {
    exec(this._getExecCommand(), function (err, stdout, stderr) {
        if (err || stderr) {
            return callback(err || stderr);
        } else {
            callback(null, stdout);
        }
    });
};

WinExe.prototype.run = function (cmd, callback) {
    this.cmd = cmd;

    if (typeof callback === 'function') {
        this._exec(callback);
    }

    return this;
};

module.exports = WinExe;
