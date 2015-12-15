'use strict';

var getos = require('getos');
var path = require('path');
var spawn = require('child_process').spawn;
var events = require('events');
var sh = require('shelljs');
var rl = require('readline');
var devnull = require('dev-null');

var getUsername = require('./username.js');

/**
 * WinExe
 * @param options
 * @returns {WinExe}
 * @constructor
 */
function WinExe(options) {
    this.host = options.host;
    this.username = getUsername(options.username);
    this.password = options.password;
    this.isWindows = process.platform === 'win32';
    this.options = {};
    if(this.isWindows) {
        if(sh.which('paexec')) {
            this.winexe = sh.which('paexec');
        }
        else {
            this.winexe = path.join(__dirname, '..', 'bin', 'paexec.exe');
        }
    }
    else if(sh.which('winexe')){
        this.winexe = sh.which('winexe');
    }

    events.EventEmitter.call(this);
    return this;
}

WinExe.super_ = events.EventEmitter;
WinExe.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: WinExe,
        enumerable: false
    }
});

/**
 * Return args for winexe or psexec
 * @private
 */
WinExe.prototype._getArgs = function () {
    return this.isWindows ? this._getArgsForPsExec() : this._getArgsForWinExe();
};

/**
 * Prepares arguments for winexe
 * @returns {Array}
 * @private
 */
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

    if (this.options) {
        if (this.options.reinstall) {
            args.push('--reinstall');
        }

        if (this.options.uninstall) {
            args.push('--uninstall');
        }
    }

    args.push('//' + this.host, this.cmd);

    return args;
};

/**
 * Prepares arguments for psexec
 * @returns {Array}
 * @private
 */
WinExe.prototype._getArgsForPsExec = function () {
    var args = [
        '\\\\' + this.host
    ];

    if (this.username) {
        args.push('-u', this.username);
    }

    if (this.password) {
        args.push('-p', this.password);
    }

    args.push('-h');
    args.push('-accepteula');

    var inQuote = false;
    var cmd = '';
    for(var i=0;i<this.cmd.length;i+=1) {
        if(this.cmd[i] === '"') {
            inQuote = !inQuote;
        }
        else if(this.cmd[i] === ' ') {
            cmd += (inQuote) ? ' ' : '\u0001';
        }
        else {
            cmd += this.cmd[i];
        }
    }
    args = args.concat(cmd.split('\u0001'));

    return args;
};

/**
 * Spawn winexe or psexec with arguments
 * @param callback
 * @private
 */
WinExe.prototype._exec = function (callback) {
    var self = this;
    var stdio = (this.isWindows) ? ['ignore', 'pipe', 'pipe'] : undefined;
    console.log(this._getArgs());
    var cp = spawn(this.winexe, this._getArgs(), {
        cwd: path.join(__dirname, '..'),
        stdio: stdio
    });


    var stdoutRL = rl.createInterface({input:cp.stdout, output:devnull()});
    var stderrRL = rl.createInterface({input:cp.stderr, output:devnull()});

    var stdout = '';

    stdoutRL.on('line', function (data) {
        stdout += data+'\n';
        self.emit('stdout', data);
    });

    var stderr = '';

    stderrRL.on('line', function (data) {
        stderr += data+'\n';
        self.emit('stderr', data);
    });

    cp.on('error', function(err) {
        self.emit('error', err);
    });

    cp.on('close', function (code) {
        if (code !== 0) {
            callback(new Error('Exit code: ' + code + '. ' + stderr.trim()), stdout, stderr);
        } else {
            callback(null, stdout, stderr);
        }
    });
};

/**
 * Run
 * @param cmd
 * @param callback
 * @returns {WinExe}
 */
WinExe.prototype.run = function (cmd, options, callback) {
    var self = this;

    this.cmd = cmd;

    if (typeof options === 'function') {
        callback = options;
    } else {
        this.options = options || {};
    }

    if (typeof callback !== 'function') {
        callback = function () {
        };
    }

    if (self.winexe === undefined && process.platform === 'linux' && process.arch === 'x64') {
        getos(function (err, os) {
            if (err) {
                callback(err);
            }

            if (os.dist.search(/ubuntu/i) === 0 || os.dist.search(/debian/i) === 0) {
                self.winexe = 'bin/winexe_ubuntu_x64';
            } else if (os.dist.search(/centos/i) === 0 || os.dist.search(/redhat/i) === 0) {
                self.winexe = 'bin/winexe_centos_x64';
            }

            self._exec(callback);
        });
    } else {
        this._exec(callback);
    }

    return this;
};

module.exports = WinExe;
