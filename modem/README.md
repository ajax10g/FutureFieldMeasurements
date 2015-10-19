### resetmodem.sh ###

Finds the Qualcomm UC20 modem by running lsusb and looking
for manufacturer and device id. It then brings down ppp0,
resets the USB modem and brings up ppp0 again. Must be run as root.

### pingtest.sh ###

Pings Googles DNS (8.8.8.8). If response is OK nothing is done.
If it is not ok, it runs resetmodem.sh. Must be run as root.
pingtest.sh should be run in a cron-job to make sure that connection
is persistent.

### usbreset.c ###

Contains the source file for resetting an USB-device.
This file is compiled with
```$ cc usbreset.c -o usbreset```

### crontab ###

This is the content of the sudo crontab -e (or root crontab)
to run the pingtest.sh script each midnight.
