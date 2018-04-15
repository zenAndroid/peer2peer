"use strict";
var socket = io();
var thisSocket = {};

// Events that will be recieved from the server
socket.on('loginOk', (peer) => {
    var headerText = document.getElementsByTagName("header")[0].innerText;
    thisSocket.peer_pseudo = peer.peer_pseudo;
    thisSocket.id = peer.id;
    headerText += " - Connecté en tant que : '" + thisSocket.peer_pseudo + "' avec ID : " + thisSocket.id + ".";
    document.getElementsByTagName("header")[0].innerText = headerText;
})
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
        option.setAttribute("data-id", id);
        option.setAttribute("data-pseudo", pseudo);
        option.text = "ID : " + id + ", nom: " + pseudo + ".";
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
        pair.innerText = "ID : " + peerList[i].id + ", nom: " + peerList[i].peer_pseudo + ".";
        newList.appendChild(pair);
    }
    originalList.replaceWith(newList)
});

socket.on('nouveau-message', (msg) => {
    var originalTable = document.getElementById("tableDeMessages");
    var newTable = document.createElement("table");
    newTable.setAttribute("id", "tableDeMessages");
    for (var i = 0; i < msg.length; i++) {
        var row = newTable.insertRow(0);
        if (msg[i].dest.peer_pseudo == thisSocket.peer_pseudo && msg[i].dest.id == thisSocket.id) {
            var autheur = row.insertCell(0)
            var contenu = row.insertCell(1)
            autheur.innerText = "ID : " + msg[i].sender.id + ", nom: " + msg[i].sender.peer_pseudo + ".";
            contenu.innerText = msg[i].body
        }
    }
    originalTable.replaceWith(newTable);
})
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
    var comboBox = document.getElementById("peerSelect");
    var selection = comboBox.options[comboBox.selectedIndex];
    var destinatairePseudo = selection.dataset.pseudo;
    var destinataireId = Number(selection.dataset.id);
    var destinataire = {
        "peer_pseudo": destinatairePseudo,
        "id": destinataireId
    }
    var contenu = document.getElementById("body").value;
    var msg = {};
    if (destinatairePseudo != "") {
        if (contenu != "") {
            // document.getElementById("dest").value = "";
            document.getElementById("body").value = "";
            msg.sender = thisSocket;
            console.log("DEBUG1 thisSocket "+ thisSocket.peer_pseudo)    
            msg.dest = {
                "peer_pseudo": destinatairePseudo,
                "id": destinataireId
            }
            console.log("DEBUG2 destinataire " + destinataire.peer_pseudo) 
            msg.body = contenu;
            console.log("DEBUG3 contenu " + contenu)

            socket.emit('envoi-message', msg);
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