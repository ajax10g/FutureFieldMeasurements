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
- Install libwebsockets: ``#apt-get install libwebsockets```
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
