CFLAGS += -g -lpaho-mqtt3c -lsoem -lpthread -L /usr/lib -lpthread -m32


PROJECT=main

all: ${PROJECT}

main:
	$(CC) -o main main.c $(CFLAGS) -I include

clean:
	rm -rf *.o ${PROJECT}
