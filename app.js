var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs'); // for persistance

app.use(express.static('static_assets'));
if (fs.existsSync("messages.json")) {
    var tousLesMessagesRawBytes = fs.readFileSync('messages.json');
    var tousLesMessages = JSON.parse(tousLesMessagesRawBytes);
} else {
    var tousLesMessages = [];
}
if (fs.existsSync("id.json")) {
    var idRawBytes = fs.readFileSync("id.json");
    var id = JSON.parse(idRawBytes);
} else {
    var id = 1;
}
if (fs.existsSync("pairs.json")) {
    var peersRawBytes = fs.readFileSync("pairs.json");
    var lesPairs = JSON.parse(peersRawBytes);
} else {
    var lesPairs = [];
}

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
        var messageData = JSON.stringify(tousLesMessages, null, 4);
        fs.writeFileSync("messages.json", messageData);
        io.emit('nouveau-message', tousLesMessages);
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
                socket.emit('loginOk', new_peer);
                succesfulLogin();
            } else { // Existing peer, maybe , should check his existence.
                var peer = {
                    "peer_pseudo": pseudo,
                    "id": Number(stringId)
                }
                if (verifyExistence(peer)) { // peer exists
                    succesfulLogin(); // Do the normal stuff ie : Collect messages and such
                    // socket.emit('exists', peer);
                    socket.emit('loginOk', peer);
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