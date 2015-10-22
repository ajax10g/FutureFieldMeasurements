#!/bin/sh
# Author: Marcus Kempe, SP Technical Research Institute of Sweden
# Copies the files from the git repo to install dirs

#Check sudo/root
EUID=$(id -u)
if [ $EUID -ne 0 ]; then
  echo "This script must be run with root privileges"
  exit 1
fi

service mosquitto stop

#Copying upstart scripts
echo "Copying upstart scripts to /etc/init."
dir="upstart"
cp $dir/*.conf /etc/init

#Get modem scripts
echo "Copying modem scripts to /etc/futurefieldmeasurements."
dir="modem"
cp -r $dir /etc/futurefieldmeasurements

#Get buses
echo "Copying buses scripts to /etc/futurefieldmeasurements."
dir="1-wire"
cp -r  $dir /etc/futurefieldmeasurements

dir="ethercat"
cp -r  $dir /etc/futurefieldmeasurements

dir="mbus"
cp -r  $dir /etc/futurefieldmeasurements

dir="modbus-rtu"
cp -r  $dir /etc/futurefieldmeasurements

dir="modbus-tcp"
cp -r  $dir /etc/futurefieldmeasurements

dir="dio"
cp -r  $dir /etc/futurefieldmeasurements

echo "Now restarting mosquitto and thus restarting all bus jobs."
dir="mosquitto"
cp  $dir/mosquitto.conf /etc/$dir/mosquitto.conf
service mosquitto start

echo "Loading crontab from file."
crontab crontab

echo "Done."
