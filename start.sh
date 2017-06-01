#!/bin/bash
read -s -p 'password: ' pw1 && \
read -s -p 'confirm: ' pw2 &&
if [ "$pw1" != "$pw2" ]
then
  echo 'Passwords don’t match.'
  exit 1
fi
NODE_ENV=production \
MAIL_USER='accounts@nields.io' \
DB_PASSWORD=$pw1 \
DB_USER=boomerang \
PORT=29171 \
HOST='https://boomerang.nields.io' \
pm2 start npm --name 'boomerang' -- start
