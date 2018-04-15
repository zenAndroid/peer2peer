var express = require("express");
var fs = require('fs'); // for persistance
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static_assets'));
var tousLesMessages = []; // un message a un "dest" et un "body"
var id = 1; // pour donner des ids
var lesPairs = []; // un pair := {"id": int,"pseudo":String}

app.get('/', (req, res) => {
    res.render('courriel.pug', {
        pretty: true
    });
});

var verifyExistence = (peer) => {
    var i = 0;
    var found = false;
    for (i = 0; i < lesPairs.length; i++) {
        if (lesPairs[i].peer_pseudo == peer.peer_pseudo && lesPairs[i].id == peer.id) {
            found = true;
        }
    }
    return found;
}
var succesfulLogin = () => {
    io.emit('updateSelect', lesPairs);
    io.emit('updatePeerList', lesPairs);
}
io.on('connection', function (socket) {
    // socket.emit('test')
    socket.on('envoi-message', (msg) => {
        tousLesMessages.push(msg); // Ajout du message dans la variable globale
        io.emit('nouveau-message',tousLesMessages);
    });
    socket.on('logIn', (pseudo, stringId) => {
        if (pseudo) {
            if (!stringId) { // New peer
                var new_peer = {
                    "peer_pseudo": pseudo,
                    "id": id++
                };
                lesPairs.push(new_peer);
                socket.emit('added', new_peer);
                succesfulLogin();
            } else { // Existing peer, maybe , should check his existence.
                var peer = {
                    "peer_pseudo": pseudo,
                    "id": Number(stringId)
                }
                if (verifyExistence(peer)) { // peer exists
                    succesfulLogin(); // Do the normal stuff ie : Collect messages and such
                    // socket.emit('exists', peer);
                } else {
                    socket.emit('peerNotFound');
                }
            }
        } else {
            socket.emit('pseudoMissing')
        }
    });
});


http.listen(3030, () => {
    console.log('listening on localhost:3030 ... ');
});