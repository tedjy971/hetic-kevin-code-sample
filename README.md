# Sécurité : Code Samples

Un exemple à utiliser pour l'exercice Sécurité.

## En local : Instructions d'utilisation (avec VSCode DevContainer)

Le projet est conçu pour un VSCode Dev Container. Instructions pour installer les dépendances et l'utiliser se trouvent [ici](https://docs.glassworks.tech/unix-shell/introduction/010-introduction/installation-party). Relancez le projet dans un DevContainer, et ouvrez un terminal.

Le DevContainer s'occupe automatiquement de la création d'un SGBDR MariaDB  

Avant de lancer le serveur il faut d'abord préparer la base de données, en tapant dans un terminal au sein du DevContainer :

```bash
mycli -h dbms -u root < ./dbms/ddl/init.sql
mycli -h dbms -u root school < ./dbms/ddl/ddl.sql
```

Le mot de passe est `rootpassword`.

Ensuite, on peut lancer le serveur avec :

```bash
# A faire une fois
npm install

# A faire pour lancer l'API
npm run server
```
L'API écoute sur le port 5055.
Le SGBDR (MariaDB) écoute sur le port 3378

Testez une route dans un navigateur [http://localhost:5055/info](http://localhost:5055/info)

## En local : Instructions d'utilisation (sans DevContainer)

Il faut d'abord installer deux dépendances :
-  [NodeJS](https://nodejs.org/en/download/package-manager)
-  Un SGBDR compatible  MySQL :
  - MacOS : [https://www.mamp.info/en/mamp/mac/](https://www.mamp.info/en/mamp/mac/)
  - Windows : [https://www.wampserver.com/en/](https://www.wampserver.com/en/)
  - [MariaDB](https://mariadb.com/downloads/)
  - [MariaDB via Docker](https://docs.glassworks.tech/securite/securisation-des-services/010-sgbdr-docker#docker-compose.yml)
- Un client SQL pour gérer votre base de données 
  

Avant de lancer le serveur il faut d'abord préparer la base de données:

- Créer une `database` avec le nom `school`.

```sql
create database IF NOT EXISTS school;
```

- Créer un utilisateur `api-dev` avec le mot de passe `api-dev-password` :

```sql
create user IF NOT EXISTS 'api-dev'@'%.%.%.%' identified by 'api-dev-password';
grant select, update, insert, delete on school.* to 'api-dev'@'%.%.%.%';
flush privileges;
```

- Initialiser le schéma de la base de données grâce au fichier [DDL](./dbms/ddl/ddl.sql).

Ensuite, dans un terminal, naviguer dans le répertoire racine de ce projet, et tapez :

Ensuite, on peut lancer le serveur avec :

```bash
# A faire une fois
npm install

# Créer des variables d'environnement
export DB_HOST=127.0.0.1
export DB_USER=api-dev
export DB_PASSWORD=api-dev-password
export DB_DATABASE=school
export DB_PORT=LE_PORT_ECOUTE_DE_VOTRE_SGBDR

# A faire pour lancer l'API
npm run server
```

L'API écoute sur le port 5055. 

Testez une route dans un navigateur [http://localhost:5055/info](http://localhost:5055/info)

## Déploiement sur un serveur de production

Notre déploiement va être simple :

- copier les codes sources sur le serveur de production
- lancer l'api avec `docker compose`

D'abord, si pas déjà fait sur votre VM, [installez Docker](https://docs.glassworks.tech/securite/securisation-des-services/010-sgbdr-docker).

Copier ce projet sur votre serveur :

- soit vous créez un compte GitHub, créez un projet, synchroniser le projet local, et le tirer sur la VM
- soit vous copiez ce projet sur votre VM avec `scp`

Naviguez dans le répertoire racine de ce projet, et tapez :

```bash
docker compose up -d
```

Grâce au fichier `docker-compose.yml` le projet est construit et lancé en tant que container docker. L'API écoute sur le port 5055.

Dans le cas d'une mise à jour de votre base de code :

```bash
# Arreter le container
docker compose down
# Reconstruire le container
docker compose build api
# Relancer le container
docker compose up -d
```

Certaines routes interrogent une base de données. Si pas déjà faites, [déployez un container MariaDB](https://docs.glassworks.tech/securite/securisation-des-services/010-sgbdr-docker#docker-compose.yml).

Avec votre client SQL :

- créez la base de données pour ce projet. Vous pouvez utiliser le nom que vous voulez.
- créez un utilisateur, et lui accordez avec les bonnes privilèges.
- initialiser le schéma avec [ce DDL](./dbms/ddl/ddl.sql)

Nous supposons, pour cet example, que le SGBDR est un service sur la même machine, configuré avec un réseau comme décrit dans la documentation dessus  : 

```yml
services:
  mon_sgbdr:
    image: mariadb
    ...

networks:
  sgbdr-network-prod:
    driver: bridge
    name: sgbdr-network-prod
```

Deux containers Docker peuvent se communiquer s'ils appartiennent au même réseau. Vous trouverez donc cette même configuration dans `docker-compose.yml`. Si vous avez modifié ses valeurs, n'oubliez pas de les modifier ici aussi !

Ils s'adressent utilisant le **nom du service**. Dans notre cas, notre API va pouvoir addresser simplement le service `mon_sgbdr` au lieu de préciser une adresse IP dans `DB_HOST`. 

Relancez l'API, cette fois si en précisant le valeurs secretes à utiliser pour connecter à la base de données via les variables d'environnement :

```bash
# Arreter le container
docker compose down

# Créer des variables d'environnement
export DB_HOST=mon_sgbdr
export DB_USER=VOTRE_UTILISATEUR_SQL
export DB_PASSWORD=VOTRE_MOT_DE_PASSE_SQL
export DB_DATABASE=LE_NOM_DE_VOTRE_BASE_DE_DONNEES


# Relancer le container
docker compose up -d
```


## Tests Postman

Un export des tests pour Postman se trouve dans [./src/test/postman/api.postman_collection.json](./src/test/postman/api.postman_collection.json)


