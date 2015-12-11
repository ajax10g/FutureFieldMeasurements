#!/bin/sh

# -q quiet
# -c nb of pings to perform

IP=8.8.8.8

EUID=$(id -u)


if [ $EUID -ne 0 ]
then
  echo "This script must be run with root privileges." 2>&1
  exit 1
fi

ping -q -c5 $IP > /dev/null
resp=$?
echo $resp
if [ $resp -eq 0 ]
then
	echo "ok"
else
	echo "nok - resetting modem"
        /bin/sh /etc/futurefieldmeasurements/modem/resetmodem.sh
fi
