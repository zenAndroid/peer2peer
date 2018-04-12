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

io.on('connection', function (socket) { // Quand un nouveau 'client' se connecte !
    console.log('a user connected !');
    // actualiser_liste_pairs();
    socket.on('envoi-message', (msg) => { // Evenement d'un evoie de message
        tousLesMessages.push(msg); // ajout du message vers la variable globale qui retient les message
        for (var i = 0; i < tousLesMessages.length; i++) { // "Debugging purposes only"
            console.log("Destinataire : " + tousLesMessages[i].dest);
            console.log("Corps du message :" + tousLesMessages[i].body);
        }
    });
    socket.on('logIn', (pseudo) => { // Detecte qaund un client entre son pseudo TODO voir si le pseudo est dans la liste existante, 
        // si oui chercher ses messages
        var pair = {
            "id": id++,
            "pseudo": pseudo
        };
        lesPairs.push(pair); // Ajout du nouvel utilisateur TODO fix this so that only new users are added
        // rs collectionner_messages(pair);
        lesPairs.forEach((peer) => { // "Debugging purposes only"
            console.log("Peer name : " + peer.pseudo + ".");
            console.log("Peer id   : " + peer.id + ".")
        });
    });
});
http.listen(3030, () => {
    console.log('listening . . .  on localhost:3030');
});