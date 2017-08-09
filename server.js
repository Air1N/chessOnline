var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

var allClients = -1;

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/lib', express.static(__dirname + '/lib'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    allClients++;
    var UserID = allClients;

    console.log('ID: ' + UserID + ' connected.');
    io.sockets.emit('userConnect', {
        UserID: UserID
    });

    socket.once('disconnect', function() {
        console.log('ID: ' + UserID + ' disconnected.');
        
        io.sockets.emit('userDisconnect', {
            UserID: UserID
        });
        
        allClients--;
    });
});

http.listen(port, function() {
    console.log('listening on *:' + (port).toString());
});
