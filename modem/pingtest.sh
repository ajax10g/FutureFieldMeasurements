#!/bin/sh

# -q quiet
# -c nb of pings to perform

IP=8.8.8.8
IP=192.168.0.99
EUID=$(id -u)


if [ $EUID -ne 0 ]
then
  echo "This script must be run with root privileges." 2>&1
  exit 1
fi

ping -q -c5 $IP > /dev/null

if [ $? -eq 0 ]
then
	echo "ok"
else
	echo "nok - resetting modem"
        sh resetmodem.sh
fi
