# Projet 7 d'Openclassrooms: Groupomania #

Réalisation du projet par **Alexandre MARIE**

## Groupomania: Créez un réseau social d’entreprise. ##

- Authentifier un utilisateur et maintenir sa session.
- Personnaliser le contenu envoyé à un client web.
- Gérer un stockage de données à l'aide de SQL.
- Implémenter un stockage de données sécurisé en utilisant SQL.

### Conditions préalables à l'initialisation du back-end ###
Vous aurez besoin d'avoir Node et `npm` installés localement sur votre machine.
A la racine du dossier back-end via le terminal saisissez `run npm install` si windows ou `sudo npm install` pour macOs (sudo: mot de passe nécessaire) 

- Renommer le fichier env.exemple fourni dans le dossier back-end en ".env" pour intégrer le pattern ci-dessous et y mettre vos informations personnelles (base de données, clé secrète ect...).

- PORT = 3000
- DB_HOST = "localhost"
- DB_USER = "root"
- DB_PASSWORD = "Mot de passe de votre compte root pour votre base de données"
- DB_DATABASE = "groupomania"
- DB_PORT = "Port par defaut de votre base de données (à configurer)"
- JWT_KEY_TOKEN = "Votre token secret (Chaine de caractère à insérer via générateur de mot de passe recommandé)"

Ouvrir MySql via l'invite de commande ou le terminal puis effectuer ces deux lignes de commandes après avoir authentifié votre compte root (mysql -u root -p) en indiquant dans le fichier .env vos informations: 

- CREATE DATABASE groupomania;
- USE groupomania;

Importer le fichier groupomania.sql (qui se trouve dans le dossier database).

- Définir le chemin vers le fichier groupomania.sql. (chemin relatif via les "/")
## Initialisation back-end ##

Il suffit ensuite d'utiliser le terminal via la commande `cd` se rendre à la racine du dossier `back-end`. Une fois positionné sur le dossier `back-end` saisissez sur le terminal `node server.js` ou `nodemon server`, il devrait alors y avoir un message de confirmation "Listening on port 3000" et un message de confirmation de la connexion à la base de données "Base de données connectée".

### Conditions préalables à l'initialisation du front-end ###

- Vous aurez besoin d'avoir Node et `npm` installés localement sur votre machine.
- Les dépendances suivantes doivent êtres installées pour lancer l'application:
    - NodeJS 12.14 or 14.0.+
    - Vue CLI v3.10 ou +
    - Node-sass

A la racine du dossier front-end via le terminal saisissez `run npm install` si windows ou `sudo npm install` pour macOs (sudo: mot de passe necessaire) et ensuite `npm install --save-dev run-script-os` 

## Initalisation front-end ##

Il suffit ensuite d'utiliser le terminal via la commande `cd` se rendre à la racine du dossier `front-end`. Une fois positionné sur le dossier `front-end` exécutez `npm run serve`. Cela devrait à la fois exécuter le serveur local et lancer votre navigateur.
Si votre navigateur ne démarre pas ou affiche une erreur 404, accédez à http://localhost:8080 dans votre navigateur.
L'application devrait se recharger automatiquement lorsque vous modifiez un fichier.
Utilisez `Ctrl+C` dans le terminal pour arrêter le serveur local.
  
### Utilisation du réseau social de l'entreprise ###

Pour s'inscrire sur l'application il faut renseigner:

- Un pseudonyme (entre 2 et 30 caractères).
- Une adresse email valide (1 seul compte possible par email).
- Un mot de passe entre 8 et 30 caractères (1 Majuscule, minuscule et 1 chiffre obligatoire)

Une fois l'utilisateur connecté il peut effectuer plusieurs opérations:

- Poster une publication avec ou sans image (format jpeg, png et gif accepté uniquement).
- Commenter sa propre publication ou commenter une publication d'un autre utilisateur.
- Modifier sa propre publication (texte obligatoire, l'image peut être changée au besoin cela n'altérera pas l'image existante).
- Supprimer un de ses commentaires sur une publication.
- Consulter les profils des utilisateurs qui ont publié un contenu sur l'application.
- Consulter son profil utilisateur et pouvoir en modifier son contenu (pseudonyme, photo de profil ou sa biographie).
- Supprimer son profil utilisateur (action irréversible).
- Se deconnecter en toute sécurité.

Un compte Administrateur est présent pour pouvoir modifier les informations mentionnées ci-dessus (posts, commentaires, utilisateurs).
Il est possible de le connecter avec les informations suivantes pour les tests: 

- Compte = "admin@groupomania.com".
- Mot de passe = "GroupomaniaP7".

Pour tester d'avantage l'application il est recommandé de créer un nouveau compte utilisateur (nottament pour tester la suppression d'un compte non admin.).

Bonne utilisation. 

**Alexandre MARIE**