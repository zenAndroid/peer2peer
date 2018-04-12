var socket = io();


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

function ajouterContact() {
    var li = document.createElement("li");
    var nomContact = document.getElementById("pseudo").value;
    if (nomContact != "") {
        li.innerText = nomContact;
        var ul = document.getElementById("listeContact");
        ul.appendChild(li);
        document.getElementById("pseudo").value = "";
    } else {
        alert("Veuillez donnez le nom du contact");
    }
}

function envoyerMessage() {
    var destinataire = document.getElementById("dest").value;
    var message = document.getElementById("body").value;
    var Message = "";
    var msg={};
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