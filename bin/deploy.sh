#!/bin/sh

USER=$1
HOST=$2
PIQTIONARY_FOLDER_PATH=$3

#ssh ${USER}@${HOST}


rsync -azP --delete --exclude='bin,config,node_modules,Jenkinsfile,READE.md,restart.txt' ../ ${USER}@${HOST}:${PIQTIONARY_FOLDER_PATH}
