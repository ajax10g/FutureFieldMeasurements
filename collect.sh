#!/bin/sh
# Author: Marcus Kempe, SP Technical Research Institute of Sweden
# Collects the configuration files from the system to the git repo folder

#Check sudo/root
EUID=$(id -u)
if [ $EUID -ne 0 ]; then
  echo "This script must be run with root privileges"
  exit 1
fi

#Get upstart scripts
dir="upstart"
if [ ! -d $dir ]; then
    mkdir $dir
fi
cp /etc/init/1-wire.conf $dir
cp /etc/init/ethercat.conf $dir
cp /etc/init/mbus.conf $dir
cp /etc/init/modbus-rtu.conf $dir
cp /etc/init/modbus-tcp.conf $dir
cp /etc/init/mosquitto.conf $dir

#Get modem scripts
dir="modem"
if [ ! -d $dir ]; then
    mkdir $dir
fi
cp /etc/futurefieldmeasurements/$dir/pingtest.sh $dir
cp /etc/futurefieldmeasurements/$dir/resetmodem.sh $dir

#Get buses
dir="1-wire"
if [ ! -d $dir ]; then
    mkdir $dir
fi
cp /etc/futurefieldmeasurements/$dir/main.py $dir

dir="ethercat"
if [ ! -d $dir ]; then
    mkdir $dir
fi
cp /etc/futurefieldmeasurements/$dir/main.py $dir

dir="mbus"
if [ ! -d $dir ]; then
    mkdir $dir
fi
cp /etc/futurefieldmeasurements/$dir/main.py $dir

dir="modbus-rtu"
if [ ! -d $dir ]; then
    mkdir $dir
fi
cp /etc/futurefieldmeasurements/$dir/main.py $dir

dir="modbus-tcp"
if [ ! -d $dir ]; then
    mkdir $dir
fi
cp /etc/futurefieldmeasurements/$dir/main.py $dir

dir="mosquitto"
if [ ! -d $dir ]; then
    mkdir $dir
fi
cp /etc/$dir/mosquitto.conf $dir

crontab -l > crontab
