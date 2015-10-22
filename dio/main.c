// Author: Marcus Kempe, SP Technical Research Institute of Serden

// Description:

// This program listens for messages on the following topics:

// Topic: /dio/setdo
// Parameters: <int1,int2>
// Response: none
// Description: Sets DO-pin at address int1 to value at int2. Where
// 0 < int1 < 8 and int2 is 0 or 1.
// Example: /dio/setdo 1,1 - Sets DO-pin 1 to HIGH.
// Example: /dio/setdo 1,0 - Sets DO pin 1 to LOW.

// Topic: /dio/getdi/<uuid>
// Parameters: <int1>
// Response: Publishes a message on topic /response/dio/getdi/<uuid>
// Where uuid is the supplied uuid in the topic from the sender.
// Description: Reads the DOI-pin at address int1 and returns the value.
// Example: /dio/getdi/9ajqla8 1 - Reads value of DIO-pin 1
// (publish) (/response/dio/getdi/9ajqla8 1) - Response with value of pin 1.

// Topic: /dio/setcom
// Parameters: <int1,int2>
// Response: none
// Description: Sets the comport int1 to type int2. Where int2 can be any of the following values:
// 1 = RS232
// 2 = RS422/RS485_4W  
// 3 = RS485_2W
// Example: /dio/setcom 1,3 - Sets comport 1 to two-wire RS485.

// Topic: /dio/getcputemp/<uuid>
// Parameters: none
// Response: Publishes a message on topic /response/dio/getcputemp/<uuid>
// Where uuid is the supplied uuid in the topic from the sender.
// Description: Reads the CPU temperature.
// Example: /dio/getcputemp/9ajqla8 - Reads CPU temp.
// (publish) (/response/dio/getdi/9ajqla8 39) - Response with CPU temo.


#include "stdio.h"
#include "stdlib.h"
#include "string.h"
#include "MQTTClient.h"
#include <signal.h>
#include <unistd.h>
#include <assert.h>
#include "libico300.h"
#include "time.h"
#define ADDRESS 	"tcp://localhost:1883"
#define CLIENTID	"Ico300"
#define LISTEN_TOPIC	"/dio/#"
#define QOS			1
#define TIMEOUT		10000L

int toStop = 0;
struct tm *tm;
time_t t;
char str_date[100];
char str_time[100];

void cfinish(int sig)
{

	t = time(NULL);
	tm = localtime(&t);

	strftime(str_time, sizeof(str_time), "%H:%M:%S", tm);
	strftime(str_date, sizeof(str_date), "%Y-%m-%d", tm);

	printf("%s %d. %s %s\n", "Got SIGINT or SIGTERM:", sig, str_date, str_time);
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

	t = time(NULL);
	tm = localtime(&t);

	strftime(str_time, sizeof(str_time), "%H:%M:%S", tm);
	strftime(str_date, sizeof(str_date), "%Y-%m-%d", tm);

	if((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
	{
		printf("Failed to connect, return code %d. %s %s\n", rc, str_date, str_time);
		exit(-1);
	}

	printf("Connected. %s %s\n",str_date,str_time);

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
			unsigned char i = 0;
		    unsigned char slen = strlen(topicName);
		    unsigned char lastSlash = 0;
		    for(i = slen-1; i>=0; i--){
		        if(*(topicName+i)==47){
		            lastSlash = i;
		            break;
		        }
		    }

		    unsigned char topicNameWithoutId [50] = {0};
		    unsigned char uuid [50] = {0};

		    if(lastSlash > 0){
		    	memcpy (topicNameWithoutId, topicName, lastSlash);
		    	topicNameWithoutId[strlen(topicNameWithoutId)] = '\0';
		    	memcpy (uuid, topicName+lastSlash+1, strlen(topicName)-lastSlash);
		    	uuid[strlen(uuid)] = '\0';
			}

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
			else if(strcmp("/dio/setcom",topicName) == 0){
				/* number: 1,2					    */
				/* type: RS232=1  RS422/RS485_4W=2  RS485_2W=3	    */
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
			    if(addr > 0 && addr < 5 && value > 0 && value < 4){
			    	char svalue[20];
			    	if(value == 1){
			    		strcpy(svalue, "RS232");
			    	}
			    	else if(value == 2){
			    		strcpy(svalue, "RS422_RS485_4W");	
			    	}
			    	else if(value == 3){
			    		strcpy(svalue, "RS485_2W");
			    	}

			    	printf("Setting comport %d to %s\n",addr,svalue);
			    	ICO300_set_comport(addr, value);
			    }
			    else{
			    	printf("Got erroneous payload in setcom %s\n",(char *)message->payload);
			    }
			}
			else if(strcmp("/dio/getdi",topicNameWithoutId) == 0){
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
				    //Append uuid
				    char stopic[100]= "/response/dio/getdi/";
				    strcat(stopic,uuid);
				    MQTTClient_publishMessage(client, stopic, &pubmsg, &token);
				    rc = MQTTClient_waitForCompletion(client, token, TIMEOUT);
				}
			}
			else if(strcmp("/dio/getcputemp",topicNameWithoutId) == 0){
				unsigned char currentVal[2] = {0};
			    ICO300_read_cpu_temp(currentVal);
			    printf("%d",currentVal[0]);
			    MQTTClient_message pubmsg = MQTTClient_message_initializer;
			    char sval[10];
			    sprintf(sval,"%d",currentVal[0]);
			    pubmsg.payload = sval;
			    pubmsg.payloadlen = strlen(sval);
			    pubmsg.qos = 1;
			    pubmsg.retained = 0;
			    MQTTClient_deliveryToken token;
			    //Append uuid
			    char stopic[100]= "/response/dio/getcputemp/";
			    strcat(stopic,uuid);
			    MQTTClient_publishMessage(client, stopic, &pubmsg, &token);
			    rc = MQTTClient_waitForCompletion(client, token, TIMEOUT);
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

	t = time(NULL);
	tm = localtime(&t);

	strftime(str_time, sizeof(str_time), "%H:%M:%S", tm);
	strftime(str_date, sizeof(str_date), "%Y-%m-%d", tm);

	printf("%s %s %s\n", "Stopping.", str_date, str_time);
	MQTTClient_disconnect(client, 10000);
	MQTTClient_destroy(&client);
	return rc;
}
