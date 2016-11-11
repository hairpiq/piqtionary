#!/bin/sh

USER=$1
HOST=$2
WORKSPACE=$3
FOLDER_PATH=$4

#ssh ${USER}@${HOST}

rsync -azP --delete --exclude='bin,config,node_modules,Jenkinsfile,READE.md,restart.txt' ${WORKSPACE}/* ${USER}@${HOST}:${FOLDER_PATH}
