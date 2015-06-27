# winexe
Wrapper around the winexe and psexec

### Install
```bash
npm install winexe
```

### Usage
```javascript
var WinExe = require('winexe');

var winexe = new WmiClient({
    username: 'LOGIN',
    password: 'PASSWORD',
    host: 'IP-ADDRESS'
});

// Run command on remote host
winexe.run('cmd.exe /c ipconfig /all', function (err, stdout, stderr) {
    // console.log(stdout);
});
```
