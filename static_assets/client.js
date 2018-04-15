"use strict";
var socket = io();
var thisSocket = {};

// Events that will be recieved from the server
socket.on('loginOk',loginOk)
socket.on('added', added);
socket.on('updateSelect', updateSelect);
socket.on('updatePeerList', updatePeerList);
socket.on('nouveau-message', nouveauMessage);

// socket.on('exists', (peer) => {
//     alert('Peer exists');
// });

function loginOk(peer){
    var headerText = document.getElementsByTagName("header")[0].innerText;
    thisSocket.peer_pseudo = peer.peer_pseudo;
    thisSocket.id = peer.id;
    headerText += " - Connecté en tant que : '" + thisSocket.peer_pseudo + "' avec ID : " + thisSocket.id + ".";
    document.getElementsByTagName("header")[0].innerText = headerText;
}

function added(peer){
    alert("Vous êtes l'utilisateur " + peer.peer_pseudo + " et votre ID est : " + peer.id);
    alert("SVP, rappelez vous de votre id, vous en aurez besoin pour vous connecter");
}
function updateSelect(peerList) {
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
}

function updatePeerList(peerList) {
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
}

function nouveauMessage(listeMessages) {
    var originalTable = document.getElementById("tableDeMessages");
    var newTable = document.createElement("table");
    newTable.setAttribute("id", "tableDeMessages");
    var row = newTable.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "Auteur";
    cell2.innerHTML = "Contenu du message";
    for (var i = 0; i < listeMessages.length; i++) {
        var row = newTable.insertRow(1);
        if (listeMessages[i].dest.peer_pseudo == thisSocket.peer_pseudo && listeMessages[i].dest.id == thisSocket.id) {
            var autheur = row.insertCell(0)
            var contenu = row.insertCell(1)
            autheur.innerText = "ID : " + listeMessages[i].sender.id + ", nom: " + listeMessages[i].sender.peer_pseudo + ".";
            contenu.innerText = listeMessages[i].body
        }
    }
    originalTable.replaceWith(newTable);
}

function afficherAcceuil() {
    document.getElementById('acceuil').style.display = "block";
    document.getElementById('nouveau').style.display = "none";
    document.getElementById('messages').style.display = "none";
    document.getElementById('contacts').style.display = "none";
}

function afficherMessages() {
    document.getElementById('acceuil').style.display = "none";
    document.getElementById('nouveau').style.display = "none";
    document.getElementById('messages').style.display = "block";
    document.getElementById('contacts').style.display = "none";
}

function afficherNouveau() {
    document.getElementById('acceuil').style.display = "none";
    document.getElementById('nouveau').style.display = "block";
    document.getElementById('messages').style.display = "none";
    document.getElementById('contacts').style.display = "none";
}

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
    var listeMessages = {};
    if (destinatairePseudo != "") {
        if (contenu != "") {
            // document.getElementById("dest").value = "";
            document.getElementById("body").value = "";
            listeMessages.sender = thisSocket;
            listeMessages.dest = destinataire;
            listeMessages.body = contenu;
            socket.emit('envoi-message', listeMessages);
        } else {
            alert("Veuillez remplir le message");
        }
    } else {
        alert("Veuillez selectionnez un destinataire !");
    }
}