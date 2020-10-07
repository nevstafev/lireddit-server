#!/bin/bash

echo enter version for tagging
read VERSION

docker build -t nevstafev/lireddit:$VERSION
docker push nevstafev/lireddit:$VERSION

ssh root@165.227.167.2 "docker pull nevstafev/lireddit:$VERSION && docker tag nevstafev/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api:$VERSION"