This software is made to run on an Axiomtek ICO-300.

Basics:

Install Ubuntu Server 14.04.

Building the 3G-modem driver:

1. Copy the ```U20_usb_driver_for_ubuntu14.04``` folder to your home
directory on the ICO-300. The usb_wwan.c has been edited to compile
on the 3.19.0-25-kernel. The edit is on line 329 where the ```smp_mb__before_clear_bit()``` has been replaced with ```smp_mb__before_atomic();```.

2. CD into the ```U20_usb_driver_for_ubuntu14.04``` directory and run
```make && make install```

3. Copy the wvdial.conf from this repo to ```/etc/wvdial.conf```. This file
has been prefilled with an APN from Telenor. Change this accordingly.

4. Install ```wvdial``` by running ```#apt-get install wvdial``` Run ```wvdial``` from the command line to enable the communication with
the modem.

5. Create an upstart service for wvdial to make it start when the computer
starts and also make it respawn if it is killed for some reason. This
upstart script is available under ```upstart/modem.conf```. This script
should be placed here on the ICO-300 ```/etc/init/modem.conf``` (TODO)

6. Make a cron job that pings for example Googles DNS (8.8.8.8) regularly,
and if that does not work, restart the wvdial service. (TODO)

