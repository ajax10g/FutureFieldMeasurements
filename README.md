This software is made to run on an Axiomtek ICO-300.

Basics:

Install Ubuntu Server 14.04.

Building the 3G-modem driver:

- Copy the ```U20_usb_driver_for_ubuntu14.04``` folder to your home
directory on the ICO-300. The usb_wwan.c has been edited to compile
on the 3.19.0-25-kernel. The edit is on line 329 where the ```smp_mb__before_clear_bit();``` has been replaced with ```smp_mb__before_atomic();```.

- CD into the ```U20_usb_driver_for_ubuntu14.04``` directory and run
```make && make install```

- Install ```wvdial``` by running ```#apt-get install wvdial```.

- Copy the wvdial.conf from ```modem/wvdial.conf``` this repo to ```/etc/wvdial.conf```. This file
has been prefilled with an APN from Telenor. Change this accordingly. Run ```wvdial``` from the command line to test the communication with the modem.

Add the ppp0 network interface:

- Edit ```/etc/network/interfaces``` and add 
```
auto ppp0
iface ppp0 inet wvdial
```

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
