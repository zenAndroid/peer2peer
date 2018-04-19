# peer2peer
A peer to peer messaging mini-server (Single Page Application) using node.js, express.js, and socket.io

#### C'est l'extension (Le projet 2) de [Courriel](https://github.com/zenAndroid/courriel).

1. Accueil
2. Liste de messages
3. Nouveau message
4. Liste de contacts


## Accueil :

- Sera la page ou le client va "s'authentifier".
- lol honestly idk how to do this one
- ???



## Liste de messages :

- Parcourir la liste globale des messages et afficher ceux qui sont destinés au client.


## Nouveau message :

- Écrire le combo box de destinataire pour qu'il montre tous les pairs sur le serveur.
- Après que le destinataire et que le corps du message est écrit, on ajoute ce message là à la liste globale de messages et le client émet l'événement qui va ensuite déclencher l'actualisation des listes de messages chez les autres clients.


## Liste de contacts :
- Parcourir la liste des pairs et les rajouter un-a-un.
- Chaque fois qu’il y aura un nouveau pair, on le rajoute à la liste globale des pairs et le client émet un événement qui déclenchera l’actu.

---

# Les événements :

| Nom d'événement | Rôle de l'événement                                                         |
| --------------- | --------------------------------------------------------------------------- |
| loginOk         | Signifie qu'une connexion s'est bien passée                                 |
| added           | Événement utilisé pour `alert` l'utilisateur de son pseudo et ID            |
| updateSelect    | Événement utilisé pour mettre à jour le combobox des pairs                  |
| updatePeerList  | Événement utilisé pour mettre à jour la liste de contacts                   |
| nouveau-message | Événement qui déclenche la fonction qui vérifie la globalité des messages   |
| peerNotFound    | Événement pour avertir l'utilisateur                                        |
| pseudoMissing   | Événement pour avertir l'utilisateur                                        |
