/** \file
 * \brief Example code for Simple Open EtherCAT master
 *
 * Usage : simple_test [ifname1]
 * ifname is NIC interface, f.e. eth0
 *
 * This is a minimal test.
 *
 * (c)Arthur Ketels 2010 - 2011
 */

#include <stdio.h>
#include <string.h>

#include "ethercattype.h"
#include "nicdrv.h"
#include "ethercatbase.h"
#include "ethercatmain.h"
#include "ethercatdc.h"
#include "ethercatcoe.h"
#include "ethercatfoe.h"
#include "ethercatconfig.h"
#include "ethercatprint.h"
#include "MQTTClient.h"
#define EC_TIMEOUTMON 500
#define ADDRESS  "tcp://localhost:1883"
#define CLIENTID  "Ico300"
#define LISTEN_TOPIC  "/ethercat/#"
#define QOS     1
#define TIMEOUT   10000L

char IOmap[4096];
OSAL_THREAD_HANDLE thread1;
OSAL_THREAD_HANDLE mqttthread;
int expectedWKC;
boolean needlf;
volatile int wkc;
boolean inOP;
uint8 currentgroup = 0;

struct tm *tm;
time_t t;
char str_date[100];
char str_time[100];


void simpletest(char *ifname)
{
    int i, j, oloop, iloop, chk;
    needlf = FALSE;
    inOP = FALSE;

   printf("Starting simple test\n");
   
   /* initialise SOEM, bind socket to ifname */
   if (ec_init(ifname))
   {   
      printf("ec_init on %s succeeded.\n",ifname);
      /* find and auto-config slaves */


       if ( ec_config_init(FALSE) > 0 )
       {
         printf("%d slaves found and configured.\n",ec_slavecount);

         ec_config_map(&IOmap);

         ec_configdc();

         printf("Slaves mapped, state to SAFE_OP.\n");
         /* wait for all slaves to reach SAFE_OP state */
         ec_statecheck(0, EC_STATE_SAFE_OP,  EC_TIMEOUTSTATE * 4);

         oloop = ec_slave[0].Obytes;
         if ((oloop == 0) && (ec_slave[0].Obits > 0)) oloop = 1;
         //if (oloop > 8) oloop = 8;
         iloop = ec_slave[0].Ibytes;
         if ((iloop == 0) && (ec_slave[0].Ibits > 0)) iloop = 1;
         //if (iloop > 8) iloop = 8;

         printf("segments : %d : %d %d %d %d\n",ec_group[0].nsegments ,ec_group[0].IOsegment[0],ec_group[0].IOsegment[1],ec_group[0].IOsegment[2],ec_group[0].IOsegment[3]);

         printf("Request operational state for all slaves\n");
         expectedWKC = (ec_group[0].outputsWKC * 2) + ec_group[0].inputsWKC;
         printf("Calculated workcounter %d\n", expectedWKC);
         ec_slave[0].state = EC_STATE_OPERATIONAL;
         /* send one valid process data to make outputs in slaves happy*/
         ec_send_processdata();
         ec_receive_processdata(EC_TIMEOUTRET);
         /* request OP state for all slaves */
         ec_writestate(0);
         chk = 40;
         /* wait for all slaves to reach OP state */
         do
         {
            ec_send_processdata();
            ec_receive_processdata(EC_TIMEOUTRET);
            ec_statecheck(0, EC_STATE_OPERATIONAL, 50000);
         }
         while (chk-- && (ec_slave[0].state != EC_STATE_OPERATIONAL));
         if (ec_slave[0].state == EC_STATE_OPERATIONAL )
         {
            printf("Operational state reached for all slaves.\n");
            inOP = TRUE;
                /* cyclic loop */
            //for(i = 1; i <= 10000; i++)
            i = 1;
            for(;;)
            {
               i++;
               ec_send_processdata();
               wkc = ec_receive_processdata(EC_TIMEOUTRET);

                    if(wkc >= expectedWKC)
                    {
                        printf("Processdata cycle %4d, WKC %d , O:", i, wkc);

                        for(j = 0 ; j < oloop; j++)
                        {
                            printf(" %2.2x", *(ec_slave[0].outputs + j));
                        }

                        printf(" I:");                  
                        for(j = 0 ; j < iloop; j++)
                        {
                            printf(" %2.2x", *(ec_slave[0].inputs + j));
                        }   
                        printf(" T:%lld\r",ec_DCtime);
                        needlf = TRUE;
                    }
                    osal_usleep(5000);
                    
                }
                inOP = FALSE;
            }
            else
            {
                printf("Not all slaves reached operational state.\n");
                ec_readstate();
                for(i = 1; i<=ec_slavecount ; i++)
                {
                    if(ec_slave[i].state != EC_STATE_OPERATIONAL)
                    {
                        printf("Slave %d State=0x%2.2x StatusCode=0x%4.4x : %s\n",
                            i, ec_slave[i].state, ec_slave[i].ALstatuscode, ec_ALstatuscode2string(ec_slave[i].ALstatuscode));
                    }
                }
            }           
            printf("\nRequest init state for all slaves\n");
            ec_slave[0].state = EC_STATE_INIT;
            /* request INIT state for all slaves */
            ec_writestate(0);
        }
        else
        {
            printf("No slaves found!\n");
        }
        printf("End simple test, close socket\n");
        /* stop SOEM, close socket */
        ec_close();
    }
    else
    {
        printf("No socket connection on %s\nExcecute as root\n",ifname);
    }   
}  

OSAL_THREAD_FUNC sendmqtt( void *ptr ) 
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
    int i, j, oloop, iloop, chk;



    while(1)
    {
        ec_timet start = osal_current_time();
        if( inOP )
        {

            if((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
            {
              printf("Failed to connect, return code %d. %s %s\n", rc, str_date, str_time);
              return;
            }
            
            oloop = ec_slave[0].Obytes;
            if ((oloop == 0) && (ec_slave[0].Obits > 0)) oloop = 1;
            //if (oloop > 8) oloop = 8;
            iloop = ec_slave[0].Ibytes;
            if ((iloop == 0) && (ec_slave[0].Ibits > 0)) iloop = 1;
            //if (iloop > 8) iloop = 8;

            //printf("Processdata cycle %4d, WKC %d , O:", i, wkc);
            char send_str[800] = {'\0'};
            char inputprefix[300] = "{\"ibytes\": [";
            char inputsuffix[300] = "], \"obytes\": [";
            char outputsuffix[5] = "]}";

            for(j = 0 ; j < oloop; j++)
            {
                char temp_str_outputs[50] = {'\0'};;
                if(j == 0){
                  sprintf(temp_str_outputs,"0x%2.2x", *(ec_slave[0].outputs + j));
                }
                else{
                  sprintf(temp_str_outputs,",0x%2.2x", *(ec_slave[0].outputs + j)); 
                }
                //strcat(send_str, temp_str_outputs);
                strcat(inputsuffix, temp_str_outputs);
            }

            for(i = 0 ; i < iloop; i++)
            {
                char temp_str_inputs[50] = {'\0'};
                if(i == 0){
                   sprintf(temp_str_inputs,"0x%2.2x", *(ec_slave[0].inputs + i));
                }
                else{
                  sprintf(temp_str_inputs,",0x%2.2x", *(ec_slave[0].inputs + i)); 
                }
                //strcat(send_str, temp_str_inputs);
                strcat(inputprefix, temp_str_inputs);
            }
            //printf(" T:%lld\r",ec_DCtime);
            strcat(inputprefix, inputsuffix);
            strcat(inputprefix, outputsuffix);
            strcat(send_str, inputprefix);

            MQTTClient_message pubmsg = MQTTClient_message_initializer;
            //char sval[10];
            //sprintf(sval, "%2.2x,%2.2x", *(ec_slave[0].outputs), *(ec_slave[0].outputs+1));
            pubmsg.payload = send_str;
            pubmsg.payloadlen = strlen(send_str);
            pubmsg.qos = 0;
            pubmsg.retained = 0;
            MQTTClient_deliveryToken token;
            MQTTClient_publishMessage(client, "/ethercat/data", &pubmsg, &token);
            rc = MQTTClient_waitForCompletion(client, token, TIMEOUT);
        }
        ec_timet end = osal_current_time();
        ec_timet diff;
        osal_time_diff(&start, &end, &diff);
        printf("Done. Now sleeping for %d us\n",10000000-diff.usec);
        osal_usleep(10000000-diff.usec); //Sleep for 10 sec nominally
    }

    printf("Destroying client.");
    MQTTClient_disconnect(client, 10000);
    MQTTClient_destroy(&client);
}

OSAL_THREAD_FUNC ecatcheck( void *ptr )
{
    int slave;

    while(1)
    {
        if( inOP && ((wkc < expectedWKC) || ec_group[currentgroup].docheckstate))
        {
            if (needlf)
            {
               needlf = FALSE;
               printf("\n");
            }
            /* one ore more slaves are not responding */
            ec_group[currentgroup].docheckstate = FALSE;
            ec_readstate();
            for (slave = 1; slave <= ec_slavecount; slave++)
            {
               if ((ec_slave[slave].group == currentgroup) && (ec_slave[slave].state != EC_STATE_OPERATIONAL))
               {
                  ec_group[currentgroup].docheckstate = TRUE;
                  if (ec_slave[slave].state == (EC_STATE_SAFE_OP + EC_STATE_ERROR))
                  {
                     printf("ERROR : slave %d is in SAFE_OP + ERROR, attempting ack.\n", slave);
                     ec_slave[slave].state = (EC_STATE_SAFE_OP + EC_STATE_ACK);
                     ec_writestate(slave);
                  }
                  else if(ec_slave[slave].state == EC_STATE_SAFE_OP)
                  {
                     printf("WARNING : slave %d is in SAFE_OP, change to OPERATIONAL.\n", slave);
                     ec_slave[slave].state = EC_STATE_OPERATIONAL;
                     ec_writestate(slave);                              
                  }
                  else if(ec_slave[slave].state > 0)
                  {
                     if (ec_reconfig_slave(slave, EC_TIMEOUTMON))
                     {
                        ec_slave[slave].islost = FALSE;
                        printf("MESSAGE : slave %d reconfigured\n",slave);                           
                     }
                  } 
                  else if(!ec_slave[slave].islost)
                  {
                     /* re-check state */
                     ec_statecheck(slave, EC_STATE_OPERATIONAL, EC_TIMEOUTRET);
                     if (!ec_slave[slave].state)
                     {
                        ec_slave[slave].islost = TRUE;
                        printf("ERROR : slave %d lost\n",slave);                           
                     }
                  }
               }
               if (ec_slave[slave].islost)
               {
                  if(!ec_slave[slave].state)
                  {
                     if (ec_recover_slave(slave, EC_TIMEOUTMON))
                     {
                        ec_slave[slave].islost = FALSE;
                        printf("MESSAGE : slave %d recovered\n",slave);                           
                     }
                  }
                  else
                  {
                     ec_slave[slave].islost = FALSE;
                     printf("MESSAGE : slave %d found\n",slave);                           
                  }
               }
            }
            if(!ec_group[currentgroup].docheckstate)
               printf("OK : all slaves resumed OPERATIONAL.\n");
        }
        osal_usleep(10000);
    }   
}   

int main(int argc, char *argv[])
{
    

    printf("SOEM (Simple Open EtherCAT Master)\nSimple test\n");

    if (argc > 1)
    {      
        /* create thread to handle slave error handling in OP */
        //      pthread_create( &thread1, NULL, (void *) &ecatcheck, (void*) &ctime);   
        osal_thread_create(&thread1, 128000, &ecatcheck, (void*) &ctime);
        osal_thread_create(&mqttthread, 128000, &sendmqtt, (void*) &ctime);
        /* start cyclic part */
        simpletest(argv[1]);
    }
    else
    {
        printf("Usage: simple_test ifname1\nifname = eth0 for example\n");
    }   
    printf("End program\n");
    return (0);
}
