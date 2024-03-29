#!/bin/sh

USER=$1
HOST=$2
WORKSPACE=$3
FOLDER_PATH=$4

rsync -azP --delete --exclude-from='bin/rsyncignore.txt' ${WORKSPACE}/ ${USER}@${HOST}:${FOLDER_PATH}

ssh ${USER}@${HOST} bash --login -c '"~/bin/on_sync_complete.bash '${FOLDER_PATH}'"'
