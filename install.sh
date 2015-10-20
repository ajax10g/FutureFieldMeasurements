#!/bin/sh
# Author: Marcus Kempe, SP Technical Research Institute of Sweden
# Copies the files from the git repo to install dirs

#Check sudo/root
EUID=$(id -u)
if [ $EUID -ne 0 ]; then
  echo "This script must be run with root privileges"
  exit 1
fi

#Copying upstart scripts
echo "Copying upstart scripts to /etc/init."
dir="upstart"
cp $dir/1-wire.conf /etc/init
cp $dir/ethercat.conf /etc/init
cp $dir/mbus.conf /etc/init
cp $dir/modbus-rtu.conf /etc/init
cp $dir/modbus-tcp.conf /etc/init

#Get modem scripts
echo "Copying modem scripts to /etc/futurefieldmeasurements."
dir="modem"
cp $dir/pingtest.sh /etc/futurefieldmeasurements/$dir
cp $dir/resetmodem.sh /etc/futurefieldmeasurements/$dir

#Get buses
echo "Copying buses scripts to /etc/futurefieldmeasurements."
dir="1-wire"
cp  $dir/main.py /etc/futurefieldmeasurements/$dir
service $dir restart

dir="ethercat"
cp  $dir/main.py /etc/futurefieldmeasurements/$dir
service $dir restart

dir="mbus"
cp  $dir/main.py /etc/futurefieldmeasurements/$dir
service $dir restart

dir="modbus-rtu"
cp  $dir/main.py /etc/futurefieldmeasurements/$dir
service $dir restart

dir="modbus-tcp"
cp  $dir/main.py /etc/futurefieldmeasurements/$dir
service $dir restart

dir="mosquitto"
cp  $dir/mosquitto.conf /etc/$dir/mosquitto.conf
service $dir restart

echo "Loading crontab from file."
crontab crontab

echo "Done."
