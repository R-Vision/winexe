# winexe
Wrapper around the winexe and psexec|paexec

### Install
```bash
npm install winexe
```

### Usage
```javascript
var WinExe = require('winexe');

var winexe = new WinExe({
    username: 'LOGIN',
    password: 'PASSWORD',
    host: 'IP-ADDRESS',
    timeout: 60000 // optional timeout in ms, winexe process will be killed with SIGKILL
});

// Run command on remote host
winexe.run('cmd.exe /c ipconfig /all', function (err, stdout, stderr) {
    // console.log(stdout);
});
```
