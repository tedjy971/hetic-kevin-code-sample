# Docker Registry

Le container `vscode_api` utilise une image Docker personnalisé. Les instructions pour sa création et déploiement sont :

```bash
# Terminal ouvert à la racine de ce projet

# D'abord : ouvrez Docker Desktop, allez dans "Reglages", et activer "Use ContainerD for pulling and storing images"

# Build l'image en local
docker buildx build --platform linux/amd64,linux/arm64  -t devops_dev_vscode -f ./docker/Dockerfile.dev .

# Trouver l'image
docker image ls | grep "devops_dev_vscode"  

# Retagger l'image avec l'adresse du repo at le numéro de version
docker tag devops_dev_vscode  rg.fr-par.scw.cloud/devops-code-samples-vscode/vscode_api:2.0.0

# Créer une clé de connexion chez scaleway
SCW_SECRET_KEY=
docker login rg.fr-par.scw.cloud/devops-code-samples-vscode -u nologin --password-stdin <<< "$SCW_SECRET_KEY"

# Envoyer l'image dans le dépôt docker sur Scaleway
docker push rg.fr-par.scw.cloud/devops-code-samples-vscode/vscode_api:2.0.0
```