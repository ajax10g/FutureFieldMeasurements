#!/bin/sh
# Author: Marcus Kempe, SP Technical Research Institute of Sweden <marcus.kempe@sp.se>
#
# Usage: Call this file to reset an USB-modem with manufacturer and device id 05c6:9003 connected to network interface ppp0
#

BASEPATH=/dev/bus/usb/
UNIT=$( lsusb | grep 05c6:9003 | perl -nE "/\D+(\d+)\D+(\d+).+/; print qq(\$1/\$2)")

echo "Bringing down ppp0"
ifdown ppp0
sleep 2
./usbreset $BASEPATH$UNIT
sleep 2
echo "Bringing up ppp0 again..."
ifup ppp0
echo "Done. Modem has been reset."
