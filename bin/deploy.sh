#!/bin/sh

USER=$1
HOST=$2
WORKSPACE=$3
FOLDER_PATH=$4

rsync -azP --delete --exclude-from='bin/rysncignore.txt' ${WORKSPACE}/ ${USER}@${HOST}:${FOLDER_PATH}

ssh ${USER}@${HOST} passenger-config restart-app ${FOLDER_PATH}
