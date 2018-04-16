var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs'); // for persistance

// Utiliser 'static_assets' comme répertoire pour fichiers statiques (*.css, *.js, etc)
app.use(express.static('static_assets'));

// Utiliser 'pug' pour la page d'acceuil.
app.get('/', (req, res) => {
    res.render('courriel.pug', {
        pretty: true
    });
});
// Por répondre à GET /messages
app.get('/messages', (req, res) => {
    res.json(tousLesMessages);
});
// Pour répondre à GET /peers
app.get('/peers',(req,res)=>{
    res.json(lesPairs);
});

// Déclaration des variables id, messages et pairs.
var id;
var tousLesMessages;
var lesPairs;
// Chargements des données à partir des fichiers locaux, s'il existent, sinon
// on les initialise avec des valeurs par défaut
if (fs.existsSync("messages.json")) {
    var tousLesMessagesRawBytes = fs.readFileSync('messages.json');
    tousLesMessages = JSON.parse(tousLesMessagesRawBytes);
} else {
    tousLesMessages = [];
}
// Chargements des données à partir des fichiers locaux, s'il existent, sinon
// on les initialise avec des valeurs par défaut
if (fs.existsSync("id.json")) {
    var idRawBytes = fs.readFileSync("id.json");
    id = JSON.parse(idRawBytes);
} else {
    id = 1;
}
// Chargements des données à partir des fichiers locaux, s'il existent, sinon
// on les initialise avec des valeurs par défaut
if (fs.existsSync("pairs.json")) {
    var peersRawBytes = fs.readFileSync("pairs.json");
    lesPairs = JSON.parse(peersRawBytes);
} else {
    lesPairs = [];
}

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
                var idData = JSON.stringify(id);
                fs.writeFileSync("id.json", id)
                lesPairs.push(new_peer);
                var peerData = JSON.stringify(lesPairs, null, 2);
                fs.writeFileSync("pairs.json", peerData);
                socket.emit('added', new_peer);
                socket.emit('loginOk', new_peer, tousLesMessages);
                succesfulLogin();
            } else { // Existing peer, maybe , should check his existence.
                var peer = {
                    "peer_pseudo": pseudo,
                    "id": Number(stringId)
                }
                if (verifyExistence(peer)) { // peer exists
                    succesfulLogin(); // Do the normal stuff ie : Collect messages and such
                    // socket.emit('exists', peer);
                    socket.emit('loginOk', peer, tousLesMessages);
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