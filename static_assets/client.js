"use strict";
var socket = io();
// Events that will be recieved from the server
socket.on('added', (peer) => {
    alert("Vous êtes l'utilisateur " + peer.peer_pseudo + " et votre ID est : " + peer.id);
});
// socket.on('exists', (peer) => {
//     alert('Peer exists');
// });

socket.on('updateSelect', (peerList) => {
    var originalSelect = document.getElementById('peerSelect');
    var newSelect = document.createElement("select");
    newSelect.setAttribute("id", "peerSelect");
    for (var i = 0; i < peerList.length; i++) {
        var pseudo = peerList[i].peer_pseudo;
        var id = peerList[i].id;
        var option = document.createElement("option");
        option.setAttribute("value", id);
        option.text = pseudo + " avec l'id " + id;
        newSelect.add(option);
    }
    originalSelect.replaceWith(newSelect);
});
socket.on('updatePeerList', (peerList) => {
    var originalList = document.getElementById("listeContact");
    var newList = document.createElement("ul");
    newList.setAttribute("id", "listeContact");
    for (var i = 0; i < peerList.length; i++) {
        var pseudo = peerList[i].peer_pseudo;
        var id = peerList[i].id;
        var pair = document.createElement("li");
        pair.innerText = "ID : " + peerList[i].id +", nom: " + peerList[i].peer_pseudo + ".";
        newList.appendChild(pair);
    }
    originalList.replaceWith(newList)
});
/*
 * Fonction qui affiche le bloc correspandant
 */
function afficherAcceuil() {
    document.getElementById('acceuil').style.display = "block";
    document.getElementById('nouveau').style.display = "none";
    document.getElementById('messages').style.display = "none";
    document.getElementById('contacts').style.display = "none";
}
/*
 * Fonction qui affiche le bloc correspandant
 */
function afficherMessages() {
    document.getElementById('acceuil').style.display = "none";
    document.getElementById('nouveau').style.display = "none";
    document.getElementById('messages').style.display = "block";
    document.getElementById('contacts').style.display = "none";
}
/*
 * Fonction qui affiche le bloc correspandant
 */
function afficherNouveau() {
    document.getElementById('acceuil').style.display = "none";
    document.getElementById('nouveau').style.display = "block";
    document.getElementById('messages').style.display = "none";
    document.getElementById('contacts').style.display = "none";
}
/*
 * Fonction qui affiche le bloc correspandant
 */
function afficherAdresses() {
    document.getElementById('acceuil').style.display = "none";
    document.getElementById('nouveau').style.display = "none";
    document.getElementById('messages').style.display = "none";
    document.getElementById('contacts').style.display = "block";
}

function envoyerMessage() {
    var destinataire = document.getElementById("dest").value;
    var message = document.getElementById("body").value;
    var Message = "";
    var msg = {};
    if (destinataire != "") {
        var MsgHeader = "Destinataire : " + destinataire;
        if (message != "") {
            var MsgBody = "Message : " + message;
            Message = MsgHeader + '\n' + MsgBody;
            document.getElementById("dest").value = "";
            document.getElementById("body").value = "";
            msg.dest = "nobody";
            msg.body = Message;
            socket.emit('envoi-message', msg);
            alert(Message);
        } else {
            alert("Veuillez remplir le message");
        }
    } else {
        alert("Veuillez entrez le nom du destinataire !");
    }
}

function ajouterMessage() {
    var table = document.getElementById("tableDeMessages");

    var auteur_string = document.getElementById("auteur").value;
    var message_body = document.getElementById("messages_body").value;
    if (auteur_string != "" && message_body != "") {
        var row = table.insertRow(1);
        var auteur = row.insertCell(0);
        var message = row.insertCell(1);
        auteur.innerText = auteur_string;
        message.innerText = message_body;
        document.getElementById("auteur").value = "";
        document.getElementById("messages_body").value = "";
    } else {
        alert("Veuiller remplir tout les champs !");
    }
}