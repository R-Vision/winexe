'use strict';

var chai = require('chai');
var getUsername = require('../lib/username.js');

var assert = chai.assert;

/*var WinExe = require('../');

 var winexe = new WinExe({
 username: null,
 password: null,
 host: '127.0.0.1'
 });

 winexe.run('ipconfig /all', function (err, result) {
 console.log(err || result);
 });*/

/*[
 'login@domain',
 'domain\login',
 'domain\\login',
 'domain/login',
 'domain//login'
 ].forEach(function (account) {

 });*/

describe('Username and domain parser', function () {
    describe('#getUsername()', function () {
        it('should return login from login', function () {
            assert.equal(getUsername('login'), 'login');
        });

        it('should return "login with space" from "login with space"', function () {
            assert.equal(getUsername('login with space'), 'login with space');
        });

        it('should return login@domain from login@domain', function () {
            assert.equal(getUsername('login@domain'), 'login@domain');
        });

        it('should return login@domain from domain\\login', function () {
            assert.equal(getUsername('domain\\login'), 'login@domain');
        });

        it('should return login@domain from domain/login', function () {
            assert.equal(getUsername('domain/login'), 'login@domain');
        });

        it('should return login@domain from domain//login', function () {
            assert.equal(getUsername('domain/login'), 'login@domain');
        });

        it('should return login@domain.name from login@domain.name', function () {
            assert.equal(getUsername('login@domain.name'), 'login@domain.name');
        });

        it('should return login@domain.name from domain.name\\login', function () {
            assert.equal(getUsername('domain.name\\login'), 'login@domain.name');
        });

        it('should return login@domain.name from domain.name/login', function () {
            assert.equal(getUsername('domain.name/login'), 'login@domain.name');
        });

        it('should return login@domain.name from domain.name//login', function () {
            assert.equal(getUsername('domain.name/login'), 'login@domain.name');
        });

        it('should return login@login@domain from login@login@domain', function () {
            assert.equal(getUsername('login@login@domain'), 'login@login@domain');
        });

        // not implemented
        it.skip('should return administr@tor@domain from domain\\administr@tor', function () {
            assert.equal(getUsername('administr@tor@domain'), 'domain\\administr@tor');
        });

        // not implemented
        it.skip('should return administr@tor@domain from domain/administr@tor', function () {
            assert.equal(getUsername('administr@tor@domain'), 'domain/administr@tor');
        });
    });
});
