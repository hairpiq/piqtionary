#!/bin/sh

rsync -azP --delete --exclude='bin,config,node_modules,Jenkinsfile,READE.md,restart.txt' ${WORKING_DIRECTORY} ${USER}@${HOST}:${PIQTIONARY_FOLDER_PATH}
