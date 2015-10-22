#LDFLAGS += -L../../git/org.eclipse.paho.mqtt.c/build/output

#IFLAGS += -Iinclude

CFLAGS += -g -lpaho-mqtt3c -lico300 -lpthread -L /usr/lib -lpthread -m32


PROJECT=main

all: ${PROJECT}

main:
	$(CC) -o main main.c $(CFLAGS) -I include

clean:
	rm -rf *.o ${PROJECT}
