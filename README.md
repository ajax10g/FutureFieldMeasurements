This software is made to run on an Axiomtek ICO-300.

Basics:

Install Ubuntu Server 14.04.

Building the 3G-modem driver:

- Copy the ```U20_usb_driver_for_ubuntu14.04``` folder to your home
directory on the ICO-300. The usb_wwan.c has been edited to compile
on the 3.19.0-25-kernel. The edit is on line 329 where the ```smp_mb__before_clear_bit();``` has been replaced with ```smp_mb__before_atomic();```.

- CD into the ```U20_usb_driver_for_ubuntu14.04``` directory and run
```make && make install```
This step will compile and install the module in the current kernel. If the kernel is upgraded
through apt with ```#apt-get update && apt-get upgrade``` the module needs to be recompiled.

- Install ```wvdial``` by running ```#apt-get install wvdial```.

- Copy the wvdial.conf from ```modem/wvdial.conf``` this repo to ```/etc/wvdial.conf```. This file
has been prefilled with an APN from Telenor. Change this accordingly. Run ```wvdial``` from the command line to test the communication with the modem.

Add the ppp0 network interface:

- Edit ```/etc/network/interfaces``` and add 
```
auto ppp0
iface ppp0 inet wvdial
```
Make the ppp0 the default route, to make all traffic go via ppp0:

- Edit ```/etc/ppp/peers/wvdial```` to look like this
```
noauth
name wvdial
usepeerdns
defaultroute
replacedefaultroute
```

Also, if ppp0 is disabled, make sure there is a default gw for the main LAN connection (p4p1 on ico-300):
```#route add default gw {GATEWAYIP} p4p1``` where the ```{GATEWAYIP}``` is replaced with the IP of the gateway you're using.

Monitor and auto-reset modem if it hangs:

- Create a cron job that pings for example Googles DNS (8.8.8.8) regularly,
and if that does not work, restart the modem. This crontab, code and scripts can
be found in the "modem" directory.

Setting the NTP-servers:

- Install ntp daemon: ```#apt-get install ntp```
- Set the time servers in ```/etc/ntp.conf``` (requires root access)
```
server ntp1.sp.se dynamic
server ntp2.sp.se dynamic
```
- Check the syncronization with the servers by running ```ntpq -p``` from the command line.

Setting up local mosquitto server as IPC with websockets enabled:

- Install cmake, ccmake, libssl and build-essential: ```#apt-get install cmake cmake-curses-gui libssl-dev build-essential```
- Install libtool and automake: ```#apt-get install libtool automake```
- Clone ```git clone git://github.com/bagder/c-ares.git```
- Cd into c-ares
- Run ```./buildconf```
- Run ```./configure```
- Run ```make && make install```
- Install libwebsockets: ``#apt-get install libwebsockets-dev```
- Clone this repo: ```git clone https://git.eclipse.org/r/mosquitto/org.eclipse.mosquitto```
- CD into org.eclipse.mosquttio
- Run ```ccmake .```
- Enable the websockets flag in the GUI ```WITH_WEBSOCKETS```
- Press c to configure
- Press g to generate configuration and exit the GUI
- While still in the  org.eclipse.mosquttio folder, runt ```make``` and ```make install```
- Edit ```/etc/mosquitto/mosquitto.conf``` and add the following to the end of the file:
```
## Websocket listeners
listener 9001 127.0.0.1
protocol websockets
```
- IF a TLS listener is needed, see this blog post: http://jpmens.net/2014/07/03/the-mosquitto-mqtt-broker-gets-websockets-support/

- Create 'mosquitto' user: ```useradd mosquitto```
- Create an upstart job for mosquitto server using the ```/etc/mosquitto/mosquitto.conf``` file. The mosquitto.conf file used for configuration of the mosquitto server is found under /mosquitto in this repo and the mosquitto.conf file used for defining the upstart job (another mosquitto.conf) is found in the upstart folder in this repo.

Using the Axiomtek BSP API (libico300.so):
- Installing the 32-bit BSP API on a 64-bit system (Work done, extend readme).
- Compiling and installing Paho MQTT C Library in 32-bit to match with BSP API to enable
DIO, serial port configuration etc via MQTT (Work done, extend readme).

Compiling SOEM library in 32-bit version:
- Clone this repo: https://github.com/OpenEtherCATsociety/SOEM
- cd SOEM
- mkdir build
- cd build
- ccmake ..
- Press 't' to toggle advanced mode.
- Find the CMAKE_C_FLAGS and press enter to edit the row.
- Type in "-m32".
- Press 'c' to configure and then 'e' to exit the output screen.
- Then press 'g' to generate the makefiles.
- Run ```make```
- Copy the static library ```libsoem.a``` to /usr/lib: ```sudo cp libsoem.a /usr/lib```

Creating a Ethercat master program with MQTT support:
- See: ```ethercat/```
- Note, the program is compiled with 32-bit support and the reason for this is that
the MQTT-library is 32-bit to adapt to the 32-bit DIO-library. Of course the 64-bit
library could be compiled and installed as well, but this is a start.

Sharing ppp0 network connection with local network (See: http://www.techytalk.info/internet-connection-sharing-without-network-manager-on-ubuntu-linux/comment-page-1/):
- Configure network interfaces for LAN 2 on the ico-300
```
auto p1p1
iface p1p1 inet static
    address 192.168.1.5
    netmask 255.255.255.0
    network 192.168.1.0
```
- Toggle the interface
```
sudo ifup p1p1
sudo ifdown p1p1
```
- Make sure ufw is installed and enabled
```
#apt-get install ufw
```
```
#ufw enable
```
- Allow connections from local subnet
```
#ufw allow from 192.168.1.0/24
```
- Edit policies
```
#nano /etc/default/ufw
```
```DEFAULT_FORWARD_POLICY="DROP"``` to ```DEFAULT_FORWARD_POLICY="ACCEPT"```
- Enable forwarding
```
#nano /etc/ufw/sysctl.conf
```
Uncomment:
```
#net/ipv4/ip_forward=1
#net/ipv6/conf/default/forwarding=1
```
- Edit before rules ```#nano/etc/ufw/before.rules```, at the end of the file (after existing ```COMMIT```):
```
# Add rules for nat table
*nat
:POSTROUTING ACCEPT [0:0]
 
# Forward traffic from eth0 through ppp0
-A POSTROUTING -s 192.168.1.0/24 -o ppp0 -j MASQUERADE
 
# Commit preceding nat table rules
COMMIT
```
- Restart ufw:
```#service ufw restart```

Installing paho-mqtt-python-client
```#apt-get install pip````
```pip install paho-mqtt````

Installing MongoDB - for meteor application
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update -y
sudo apt-get install mongodb-org mongodb-org-server mongodb-org-shell mongodb-org-tools -y
```
Installing Node - for meteor application
```
wget http://nodejs.org/dist/v0.10.36/node-v0.10.36-linux-x64.tar.gz
sudo mv node-v0.10.36-linux-x64 /opt/nodejs
sudo ln -sf /opt/nodejs/bin/node /usr/bin/node
sudo ln -sf /opt/nodejs/bin/npm /usr/bin/npm
```
Setting up directories under /opt/future-field-meteor for meteor app
```
sudo mkdir -p /opt/future-field-meteor/
sudo mkdir -p /opt/future-field-meteor/config
sudo mkdir -p /opt/future-field-meteor/tmp
sudo chown ${USER} /opt/future-field-meteor -R
```
Installing forever etc for meteor app
```
sudo npm install -g forever userdown wait-for-mongo node-gyp
```
Creating environment variables for meteor:
```
export PORT=80
export MONGO_URL=mongodb://127.0.0.1/future-field-meteor
export ROOT_URL=http://localhost
```
Installing meteor and running the app from node
- Creating meteoruser
- Creating meteor group
- adding development user to group etc...
```
TODO
```
