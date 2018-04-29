# peer2peer
A peer to peer messaging mini-server (Single Page Application) using node.js, express.js, and socket.io

#### C'est l'extension (Le projet 2) de [Courriel](https://github.com/zenAndroid/courriel).

## Constituants de l'interface client : (ce que l'on voie sur la page d'accueil)
1. Accueil
2. Liste de messages
3. Nouveau message
4. Liste de contacts


## Accueil :

- Sera la page ou le client va "s'authentifier".

#### Système d'authentification :

###### Scénario 1 : Première connexion :

Initialement, quand un client X accède au serveur, il est accueillé par un premier Prompt pour
entrer son pseudonyme, après ça, un autre prompt lui demande un numéro d'identification (nommé ID).

Puisque c'est le premier accès du client X, il ne fournit pas d'ID, et donc le serveur lui en fournit un nouveau.

Une `alert` lui affiche alors son pseudonyme ainsi que son numéro d'identification et lui rappelle
qu'il doit s'en rappelle obligatoirement pour pouvoir utiliser la messagerie.

###### Scénario 2 : Connexions prochaines :

Lorsque le client est déjà enregistré est qu'il veut accéder à son "compte", il doit fournir son
pseudonyme et le numéro d'identification que le système lui a fournit.


Si le client fournit une valeur d'ID non existante. Le système le notifie et le demande d'actualiser
la page pour retenter la connection.


## Liste de messages :

- Parcourir la liste globale des messages et afficher ceux qui sont destinés au client.

### Fonctionnement détaillé :

Aprés le succés de connection d'un client, ses coordonées sont stocké dans un objet local `thisSocket`, et 
alors l'application commence a parcourir l'objet qui stocke tous les messages et affiche tous les messages dont le destinataire est le même que l'utilisateur enregistré dans `thisSocket`.


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
