var express = require("express");
var fs = require('fs'); // for persistance
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static_assets'));
var tousLesMessages = []; // un message a un "dest" et un "body"
var id = 0; // pour donner des ids
var lesPairs = []; // un pair := {"id": int,"pseudo":String}

app.get('/', (req, res) => {
    res.render('courriel.pug', {
        pretty: true
    });
});

var successfulLogin = (peer) => {
    console.log("at succesfulLogin");
};

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

io.on('connection', function (socket) { // Quand un nouveau 'client' se connecte !
    console.log('a user connected !');
    // actualiser_liste_pairs();
    socket.on('envoi-message', (msg) => {

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
            } else { // Existing peer, maybe , should check his existence.
                var peer = {
                    "peer_pseudo": pseudo,
                    "id": Number(stringId)
                }
                if (verifyExistence(peer)) { // peer exists
                    successfulLogin(peer); // Do the normal stuff ie : Collect messages and such
                    socket.emit('exists', peer);
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