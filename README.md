# Projet messagerie agence

Ce projet est une application en TypeScript utilisant React comme framework et vite commme build.  
Elle permet de lire les messages laissés pour les différentes agences.  
  
## L'API Docker

### Installation

Si Docker est déjà installé sur votre machine, allez directement à la prochaine l'étape, autrement:

* Pour installer Docker Desktop, aller sur le lien suivant [Docker](https://www.docker.com/get-started).  

### Démarrer l'API

Le [Swagger](https://swagger.io/solutions/api-documentation/) et l'API sont disponibles à l'adresse suivante http://localhost:8080 en utilisant la commande suivante:

    docker run -p 8080:8080 --rm --name MA-FTT-API meilleursagents/frontend-technical-test-api
    
## Lancement de l'application

### Installation

Cloner le repository et taper la commande 'yarn install'.

### Démarrer l'application

Après le succès de l'installation des packages, taper la commande 'yarn dev'.  

### Voilà le projet est lancé, bonne visite.
