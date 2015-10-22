#include "stdio.h"
#include "stdlib.h"
#include "string.h"
#include "MQTTClient.h"
#include <signal.h>
#include <unistd.h>
#include <assert.h>
#include "libico300.h"
#define ADDRESS 	"tcp://localhost:1883"
#define CLIENTID	"Ico300"
#define LISTEN_TOPIC	"/dio/#"
#define QOS			1
#define TIMEOUT		10000L

int toStop = 0;

void cfinish(int sig)
{
	printf("%s %d\n", "Got SIGINT or SIGTERM.", sig);
	signal(SIGINT, NULL);
	toStop = 1;
}

char** str_split(char* a_str, const char a_delim)
{
    char** result    = 0;
    size_t count     = 0;
    char* tmp        = a_str;
    char* last_comma = 0;
    char delim[2];
    delim[0] = a_delim;
    delim[1] = 0;

    /* Count how many elements will be extracted. */
    while (*tmp)
    {
        if (a_delim == *tmp)
        {
            count++;
            last_comma = tmp;
        }
        tmp++;
    }

    /* Add space for trailing token. */
    count += last_comma < (a_str + strlen(a_str) - 1);

    /* Add space for terminating null string so caller
       knows where the list of returned strings ends. */
    count++;

    result = malloc(sizeof(char*) * count);

    if (result)
    {
        size_t idx  = 0;
        char* token = strtok(a_str, delim);

        while (token)
        {
            assert(idx < count);
            *(result + idx++) = strdup(token);
            token = strtok(0, delim);
        }
        assert(idx == count - 1);
        *(result + idx) = 0;
    }

    return result;
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
	int showtopics = 0;
	int nodelimiter = 1;
	if((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
	{
		printf("Failed to connect, return code %d\n", rc);
		exit(-1);
	}

	printf("%s\n", "Connected.");

	signal(SIGINT, cfinish);
	signal(SIGTERM, cfinish);

	rc = MQTTClient_subscribe(client, LISTEN_TOPIC, QOS);

	printf("%s\n", "Going into loop.");
	while(!toStop){
		char* topicName = NULL;
		int topicLen;
		MQTTClient_message* message = NULL;
		
		rc = MQTTClient_receive(client, &topicName, &topicLen, &message, 1000);
		if (message)
		{
			// if (showtopics)
			// 	printf("%s\t", topicName);
   //    		if (nodelimiter)
			// 	printf("%.*s", message->payloadlen, (char*)message->payload);
			// else
			// 	printf("%.*s%s", message->payloadlen, (char*)message->payload, "<DELIM>");

			if(strcmp("/dio/setdo",topicName) == 0){
				char** tokens;
			    tokens = str_split(message->payload, ',');
			    int addr = 0;
			    int value = 0;
			    if (tokens)
			    {
			        int i;
			        for (i = 0; *(tokens + i); i++)
			        {
			        	//Expect two numbers: address and value
			        	if(i == 0){
			        		addr = atoi(*(tokens+i));
			        		//printf("Got address: %d\n",addr);

			        	}
			        	else if(i == 1){
			        		value = atoi(*(tokens+i));
			        		//printf("Got value: %d\n",value);
			        	}
			            free(*(tokens + i));
			        }
			        free(tokens);
			    }
			    unsigned char currentVal = 0;
			    unsigned char newVal = 0;
			    ICO300_get_DO(&currentVal);
			    if(value == 1){
			    	newVal = currentVal | 1<<addr;
			    	ICO300_set_DO(newVal);
			    }
			    else if(value == 0){
			    	newVal = currentVal & 0<<addr;
			    	ICO300_set_DO(newVal);
			    }
			    else{
			    	printf("Got erroneous payload in setdo %s\n",(char *)message->payload);
			    }
			}
			else if(strcmp("/dio/getdi",topicName) == 0){
				char val = atoi((char*)message->payload);
				if((val > -1) && (val < 8)){
				    unsigned char currentVal = 0;
				    ICO300_get_DI(&currentVal);
				    char sval[2];
				    sprintf(sval,"%d",(currentVal & 1 << val)>>val);
				    MQTTClient_message pubmsg = MQTTClient_message_initializer;
				    pubmsg.payload = sval;
				    pubmsg.payloadlen = strlen(sval);
				    pubmsg.qos = 1;
				    pubmsg.retained = 0;
				    MQTTClient_deliveryToken token;
				    MQTTClient_publishMessage(client, "/dio/getdi/response", &pubmsg, &token);
				    rc = MQTTClient_waitForCompletion(client, token, TIMEOUT);
				}
			}
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
