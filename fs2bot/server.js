//'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

http.createServer(function (req, res) {

    var m = new Date();
    var dateString =
        m.getUTCFullYear() + "/" +
        ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello Dave\n' + dateString);
}).listen(port);

var fs2bot = require('./bot.js');
