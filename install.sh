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

echo 'Copying wvdial.conf to /etc/wvdial.conf'
cp modem/wvdial.conf /etc/wvdial.conf

echo 'Copying option U20-usb-modem-driver to kernel source dir /usr/src/option-1.0'
mkdir /usr/src/option-1.0
cp -r modem/src /usr/src/option-1.0/src
cp modem/dkms.conf /usr/src/option-1.0/dkms.conf

#Copying upstart scripts
echo "Copying upstart scripts to /etc/init."
dir="upstart"
cp $dir/*.conf /etc/init

#Get modem scripts
echo "Copying modem scripts to /etc/futurefieldmeasurements."
dir="modem"
cp -r $dir /etc/futurefieldmeasurements

echo "Compiling usb-reset program."
gcc /etc/futurefieldmeasurements/$dir/usbreset.c -o /etc/futurefieldmeasurements/$dir/usbreset

#Get buses
echo "Copying buses scripts to /etc/futurefieldmeasurements."
dir="1-wire"
cp -r  $dir /etc/futurefieldmeasurements

dir="ethercat"
cp -r $dir /etc/futurefieldmeasurements

dir="mbus"
cp -r $dir /etc/futurefieldmeasurements

dir="modbus-rtu"
cp -r $dir /etc/futurefieldmeasurements

dir="modbus-tcp"
cp -r $dir /etc/futurefieldmeasurements

dir="dio"
cp -r $dir /etc/futurefieldmeasurements

#Copy meteor project to /opt/future-field-meteor/app
dir="meteor"
rm -r /opt/future-field-meteor
cp -r $dir /opt/future-field-meteor
(cd /opt/future-field-meteor/programs/server && /usr/bin/npm install)
chown -R meteoruser:meteor /opt/future-field-meteor/
chmod -R 770 /opt/future-field-meteor

echo "Now restarting mosquitto and thus restarting all bus jobs."
dir="mosquitto"
cp  $dir/mosquitto.conf /etc/$dir/mosquitto.conf
service mosquitto start

echo "Loading crontab from file."
crontab crontab

echo "Done."
