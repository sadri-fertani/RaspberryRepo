var spawn = require('child_process').spawn;
var http = require('http');

var child = spawn('/opt/vc/bin/raspivid', ['-ih', '-hf', '-w', '1280', '-h', '1024', '-rot', '180', '-t', '999999999', '-fps', '20', '-b', '5000000', '-o', '-']);

var server = http.createServer((request, response) => {
    child.stdout.pipe(response);
});

server.listen(8080);

console.log('Server is listening on port 8080')