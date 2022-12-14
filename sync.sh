#!/usr/bin/env bash

set -e

echo "Starting sync..."

cd /root/madmeme

git fetch
git reset --hard origin/main

cd backend
npm i
cd ..

cp madmeme.service /lib/systemd/system/
systemctl daemon-reload
systemctl restart madmeme

echo "Done sync!"
