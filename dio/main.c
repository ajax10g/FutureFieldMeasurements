#include "stdio.h"
#include "stdlib.h"
#include "string.h"
#include "MQTTClient.h"
#include <signal.h>
#include <unistd.h>
#include "libico300.h"

#define ADDRESS 	"tcp://localhost:1883"
#define CLIENTID	"Ico300"
#define TOPIC		"/output/dio"
#define QOS			1
#define TIMEOUT		10000L

int toStop = 0;

void cfinish(int sig)
{
	printf("%s %d\n", "Got SIGINT or SIGTERM.", sig);
	signal(SIGINT, NULL);
	toStop = 1;
}

int main(int argc, char* argv[])
{
	MQTTClient client;
	MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;
	int rc = 0;

	MQTTClient_create(&client, ADDRESS, CLIENTID, MQTTCLIENT_PERSISTENCE_NONE, NULL);
	conn_opts.keepAliveInterval = 20;
	conn_opts.cleansession = 1;
	conn_opts.username = "marcus";
	conn_opts.password = "test";
	int showtopics = 1;
	int nodelimiter = 1;
	if((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
	{
		printf("Failed to connect, return code %d\n", rc);
		exit(-1);
	}

	printf("%s\n", "Connected.");

	signal(SIGINT, cfinish);
	signal(SIGTERM, cfinish);

	rc = MQTTClient_subscribe(client, TOPIC, QOS);

	printf("%s\n", "Going into loop.");
	while(!toStop){
		char* topicName = NULL;
		int topicLen;
		MQTTClient_message* message = NULL;
		
		rc = MQTTClient_receive(client, &topicName, &topicLen, &message, 1000);
		if (message)
		{
			if (showtopics)
				printf("%s\t", topicName);
      		if (nodelimiter)
				printf("%.*s", message->payloadlen, (char*)message->payload);
			else
				printf("%.*s%s", message->payloadlen, (char*)message->payload, "<DELIM>");
			char val = atoi((char*)message->payload);
			printf("Got integer: %d",val);

			ICO300_set_DO(val); //set all DO high
			ICO300_print_DIO_status();

			fflush(stdout);
			MQTTClient_freeMessage(&message);
			MQTTClient_free(topicName);
		}
		if (rc != 0){
			int rc = 0;
			if ((rc = MQTTClient_connect(client, &conn_opts)) != 0)
			{
				printf("Failed to connect, return code %d\n", rc);
				exit(-1);	
			}
		}
	}

	printf("%s\n", "Stopping.");
	MQTTClient_disconnect(client, 10000);
	MQTTClient_destroy(&client);
	return rc;
}
