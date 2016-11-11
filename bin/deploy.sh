#!/bin/sh

USER=$1
HOST=$2
WORKSPACE=$3
FOLDER_PATH=$4

#ssh ${USER}@${HOST}

rsync -azP --delete --exclude-from='exclude-list.txt' ${WORKSPACE}/ ${USER}@${HOST}:${FOLDER_PATH}
