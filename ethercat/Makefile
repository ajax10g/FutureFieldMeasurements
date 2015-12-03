CFLAGS += -g -lpaho-mqtt3c -lsoem -lpthread -L /usr/lib -lpthread -lm -m32


PROJECT=main

all: ${PROJECT}

main:
	$(CC) include/cJSON.c -o main main.c $(CFLAGS) -I include

clean:
	rm -rf *.o ${PROJECT}
