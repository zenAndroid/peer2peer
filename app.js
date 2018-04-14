var express = require("express");
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
    lesPairs.forEach((pair) => {
        if (pair == peer) {
            return true; // Peer exists, returning,
        }
    })
}

io.on('connection', function (socket) { // Quand un nouveau 'client' se connecte !
    console.log('a user connected !');
    // actualiser_liste_pairs();
    socket.on('envoi-message', (msg) => {

    });
    socket.on('logIn', (pseudo, stringId) => {
        if (pseudo) {
            if (!stringId) {                 // New peer
                var new_peer = {
                    "peer_pseudo": pseudo,
                    "id": id++
                };
                lesPairs.push(new_peer);
            } else {                         // Existing peer, maybe , should check his existence.
                var peer = {
                    "peer_pseudo": pseudo,
                    "id": Number(stringId)
                }
                if (verifyExistence(peer)) { // peer exists
                    successfulLogin(peer);   // Do the normal stuff ie : Collect messages and such
                } else {
                    socket.emit('peerNotFound');
                }
            }
        }else{
            socket.emit('pseudoMissing')
        }
    });
});


http.listen(3030, () => {
    console.log('listening on localhost:3030 ... ');
});