obj-m+=usb_wwan.o
obj-m+=option.o
obj-m+=qcserial.o

KERNELDIR := /lib/modules/$(shell uname -r)/build
PWD       := $(shell pwd)

default:
	$(MAKE) -Werror -C $(KERNELDIR) M=$(PWD) modules
	ls -l *.ko

install: default
	cp option.ko /lib/modules/$(shell uname -r)/kernel/drivers/usb/serial/
	cp usb_wwan.ko /lib/modules/$(shell uname -r)/kernel/drivers/usb/serial/
	cp qcserial.ko /lib/modules/$(shell uname -r)/kernel/drivers/usb/serial/
	depmod
	modprobe option

uninstall:
	rmmod option
	rmmod usb_wwan
	rm /lib/modules/$(shell uname -r)/kernel/drivers/usb/serial/option.ko
	rm /lib/modules/$(shell uname -r)/kernel/drivers/usb/serial/usb_wwan.ko

clean:
	rm -rf *.o *~ core .depend .*.cmd *.ko *.mod.c .tmp_versions modules.order Module.symvers
