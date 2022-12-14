#!/usr/bin/env bash

set -e

git pull

cd backend
npm i
cd ..

cp madmeme.service /lib/systemd/system/
systemctl daemon-reload
systemctl restart madmeme
