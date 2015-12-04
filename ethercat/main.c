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
#include <stdlib.h>
#include <time.h>

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

#include "cJSON.h"

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

ec_ODlistt ODlist;
ec_OElistt OElist;

char usdo[128];
char hstr[24];

char* dtype2string(uint16 dtype)
{
    switch(dtype)
    {
        case ECT_BOOLEAN:
            sprintf(hstr, "BOOLEAN");
            break;
        case ECT_INTEGER8:
            sprintf(hstr, "INTEGER8");
            break;
        case ECT_INTEGER16:
            sprintf(hstr, "INTEGER16");
            break;
        case ECT_INTEGER32:
            sprintf(hstr, "INTEGER32");
            break;
        case ECT_INTEGER24:
            sprintf(hstr, "INTEGER24");
            break;
        case ECT_INTEGER64:
            sprintf(hstr, "INTEGER64");
            break;
        case ECT_UNSIGNED8:
            sprintf(hstr, "UNSIGNED8");
            break;
        case ECT_UNSIGNED16:
            sprintf(hstr, "UNSIGNED16");
            break;
        case ECT_UNSIGNED32:
            sprintf(hstr, "UNSIGNED32");
            break;
        case ECT_UNSIGNED24:
            sprintf(hstr, "UNSIGNED24");
            break;
        case ECT_UNSIGNED64:
            sprintf(hstr, "UNSIGNED64");
            break;
        case ECT_REAL32:
            sprintf(hstr, "REAL32");
            break;
        case ECT_REAL64:
            sprintf(hstr, "REAL64");
            break;
        case ECT_BIT1:
            sprintf(hstr, "BIT1");
            break;
        case ECT_BIT2:
            sprintf(hstr, "BIT2");
            break;
        case ECT_BIT3:
            sprintf(hstr, "BIT3");
            break;
        case ECT_BIT4:
            sprintf(hstr, "BIT4");
            break;
        case ECT_BIT5:
            sprintf(hstr, "BIT5");
            break;
        case ECT_BIT6:
            sprintf(hstr, "BIT6");
            break;
        case ECT_BIT7:
            sprintf(hstr, "BIT7");
            break;
        case ECT_BIT8:
            sprintf(hstr, "BIT8");
            break;
        case ECT_VISIBLE_STRING:
            sprintf(hstr, "VISIBLE_STRING");
            break;
        case ECT_OCTET_STRING:
            sprintf(hstr, "OCTET_STRING");
            break;
        default:
            sprintf(hstr, "Type 0x%4.4X", dtype);
    }
    return hstr;
}

char* SDO2string(uint16 slave, uint16 index, uint8 subidx, uint16 dtype)
{
   int l = sizeof(usdo) - 1, i;
   uint8 *u8;
   int8 *i8;
   uint16 *u16;
   int16 *i16;
   uint32 *u32;
   int32 *i32;
   uint64 *u64;
   int64 *i64;
   float *sr;
   double *dr;
   char es[32];

   memset(&usdo, 0, 128);
   ec_SDOread(slave, index, subidx, FALSE, &l, &usdo, EC_TIMEOUTRXM);
   if (EcatError)
   {
      return ec_elist2string();
   }
   else
   {
      switch(dtype)
      {
         case ECT_BOOLEAN:
            u8 = (uint8*) &usdo[0];
            if (*u8) sprintf(hstr, "TRUE");
             else sprintf(hstr, "FALSE");
            break;
         case ECT_INTEGER8:
            i8 = (int8*) &usdo[0];
            sprintf(hstr, "0x%2.2x %d", *i8, *i8);
            break;
         case ECT_INTEGER16:
            i16 = (int16*) &usdo[0];
            sprintf(hstr, "0x%4.4x %d", *i16, *i16);
            break;
         case ECT_INTEGER32:
         case ECT_INTEGER24:
            i32 = (int32*) &usdo[0];
            sprintf(hstr, "0x%8.8x %d", *i32, *i32);
            break;
         case ECT_INTEGER64:
            i64 = (int64*) &usdo[0];
            sprintf(hstr, "0x%16.16llx %lld", *i64, *i64);
            break;
         case ECT_UNSIGNED8:
            u8 = (uint8*) &usdo[0];
            sprintf(hstr, "0x%2.2x %u", *u8, *u8);
            break;
         case ECT_UNSIGNED16:
            u16 = (uint16*) &usdo[0];
            sprintf(hstr, "0x%4.4x %u", *u16, *u16);
            break;
         case ECT_UNSIGNED32:
         case ECT_UNSIGNED24:
            u32 = (uint32*) &usdo[0];
            sprintf(hstr, "0x%8.8x %u", *u32, *u32);
            break;
         case ECT_UNSIGNED64:
            u64 = (uint64*) &usdo[0];
            sprintf(hstr, "0x%16.16llx %llu", *u64, *u64);
            break;
         case ECT_REAL32:
            sr = (float*) &usdo[0];
            sprintf(hstr, "%f", *sr);
            break;
         case ECT_REAL64:
            dr = (double*) &usdo[0];
            sprintf(hstr, "%f", *dr);
            break;
         case ECT_BIT1:
         case ECT_BIT2:
         case ECT_BIT3:
         case ECT_BIT4:
         case ECT_BIT5:
         case ECT_BIT6:
         case ECT_BIT7:
         case ECT_BIT8:
            u8 = (uint8*) &usdo[0];
            sprintf(hstr, "0x%x", *u8);
            break;
         case ECT_VISIBLE_STRING:
            strcpy(hstr, usdo);
            break;
         case ECT_OCTET_STRING:
            hstr[0] = 0x00;
            for (i = 0 ; i < l ; i++)
            {
               sprintf(es, "0x%2.2x ", usdo[i]);
               strcat( hstr, es);
            }
            break;
         default:
            sprintf(hstr, "Unknown type");
      }
      return hstr;
   }
}

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
                        /*printf("Processdata cycle %4d, WKC %d , O:", i, wkc);

                        for(j = 0 ; j < oloop; j++)
                        {
                            printf(" %2.2x", *(ec_slave[0].outputs + j));
                        }

                        printf(" I:");                  
                        for(j = 0 ; j < iloop; j++)
                        {
                            printf(" %2.2x", *(ec_slave[0].inputs + j));
                        }   
                        printf(" T:%lld\r",ec_DCtime);*/
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
              osal_usleep(1000000);
              continue;
            }
            
            oloop = ec_slave[0].Obytes;
            if ((oloop == 0) && (ec_slave[0].Obits > 0)) oloop = 1;
            //if (oloop > 8) oloop = 8;
            iloop = ec_slave[0].Ibytes;
            if ((iloop == 0) && (ec_slave[0].Ibits > 0)) iloop = 1;
            //if (iloop > 8) iloop = 8;

            //printf("Processdata cycle %4d, WKC %d , O:", i, wkc);
            char send_str[800] = {'\0'};

	    struct timeval tv;
            gettimeofday(&tv,NULL);
            uint64_t ms = tv.tv_sec*(uint64_t)1000+tv.tv_usec/1000;

            printf("Sending first message!");

            char inputprefix[300] = {'\0'};
            sprintf(inputprefix,"{\"timestamp\":%llu,\"ibytes\": [",ms);
            char inputsuffix[300] = "], \"obytes\": [";
            char outputsuffix[5] = "]}";

            for(j = 0 ; j < oloop; j++)
            {
                char temp_str_outputs[50] = {'\0'};;
                if(j == 0){
                  sprintf(temp_str_outputs,"%d", *(ec_slave[0].outputs + j));
                }
                else{
                  sprintf(temp_str_outputs,",%d", *(ec_slave[0].outputs + j)); 
                }
                //strcat(send_str, temp_str_outputs);
                strcat(inputsuffix, temp_str_outputs);
            }

            for(i = 0 ; i < iloop; i++)
            {
                char temp_str_inputs[50] = {'\0'};
                if(i == 0){
                   sprintf(temp_str_inputs,"%d", *(ec_slave[0].inputs + i));
                }
                else{
                  sprintf(temp_str_inputs,",%d", *(ec_slave[0].inputs + i)); 
                }
                //strcat(send_str, temp_str_inputs);
                strcat(inputprefix, temp_str_inputs);
            }
            //printf(" T:%lld\r",ec_DCtime);
            strcat(inputprefix, inputsuffix);
            strcat(inputprefix, outputsuffix);
            strcat(send_str, inputprefix);
            printf("%s",send_str);

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

struct Signal {
    int abs_offset;
    int abs_bit;
    int bitlen;
    char type[24];
    char name[24];
};

struct Slave {
    char name[24];
    struct Signal inputs[24];
    struct Signal outputs[24];
    int nofInputs;
    int nofOutputs; 
};

struct Slave slaves[20];
int nofSlaves = 0;

/** Read PDO assign structure */
int si_PDOassign(uint16 slave, uint16 PDOassign, int mapoffset, int bitoffset, int t)
{
    uint16 idxloop, nidx, subidxloop, rdat, idx, subidx;
    uint8 subcnt;
    int wkc, bsize = 0, rdl;
    int32 rdat2;
    uint8 bitlen, obj_subidx;
    uint16 obj_idx;
    int abs_offset, abs_bit;

    rdl = sizeof(rdat); rdat = 0;
    /* read PDO assign subindex 0 ( = number of PDO's) */
    wkc = ec_SDOread(slave, PDOassign, 0x00, FALSE, &rdl, &rdat, EC_TIMEOUTRXM);
    rdat = etohs(rdat);
    /* positive result from slave ? */
    if ((wkc > 0) && (rdat > 0))
    {
        /* number of available sub indexes */
        nidx = rdat;
        bsize = 0;
        /* read all PDO's */
        for (idxloop = 1; idxloop <= nidx; idxloop++)
        {
            rdl = sizeof(rdat); rdat = 0;
            /* read PDO assign */
            wkc = ec_SDOread(slave, PDOassign, (uint8)idxloop, FALSE, &rdl, &rdat, EC_TIMEOUTRXM);
            /* result is index of PDO */
            idx = etohl(rdat);
            if (idx > 0)
            {
                rdl = sizeof(subcnt); subcnt = 0;
                /* read number of subindexes of PDO */
                wkc = ec_SDOread(slave,idx, 0x00, FALSE, &rdl, &subcnt, EC_TIMEOUTRXM);
                subidx = subcnt;
                /* for each subindex */
                for (subidxloop = 1; subidxloop <= subidx; subidxloop++)
                {
                    rdl = sizeof(rdat2); rdat2 = 0;
                    /* read SDO that is mapped in PDO */
                    wkc = ec_SDOread(slave, idx, (uint8)subidxloop, FALSE, &rdl, &rdat2, EC_TIMEOUTRXM);
                    rdat2 = etohl(rdat2);
                    /* extract bitlength of SDO */
                    bitlen = LO_BYTE(rdat2);
                    bsize += bitlen;
                    obj_idx = (uint16)(rdat2 >> 16);
                    obj_subidx = (uint8)((rdat2 >> 8) & 0x000000ff);
                    abs_offset = mapoffset + (bitoffset / 8);
                    abs_bit = bitoffset % 8;
                    ODlist.Slave = slave;
                    ODlist.Index[0] = obj_idx;
                    OElist.Entries = 0;
                    wkc = 0;
                    /* read object entry from dictionary if not a filler (0x0000:0x00) */
                    if(obj_idx || obj_subidx)
                        wkc = ec_readOEsingle(0, obj_subidx, &ODlist, &OElist);
                    printf("  [0x%4.4X.%1d] 0x%4.4X:0x%2.2X 0x%2.2X", abs_offset, abs_bit, obj_idx, obj_subidx, bitlen);

                    struct Signal *tmpSig = (struct Signal*)malloc(sizeof(struct Signal));                    

                    tmpSig->abs_offset = abs_offset;
                    tmpSig->abs_bit = abs_bit;
                    tmpSig->bitlen = bitlen;                

                    struct Slave *tmpSlave = &slaves[slave];                                         

                    if((wkc > 0) && OElist.Entries)
                    {
                        printf(" %-12s %s\n", dtype2string(OElist.DataType[obj_subidx]), OElist.Name[obj_subidx]);
                        sprintf(tmpSig->type,"%s",dtype2string(OElist.DataType[obj_subidx]));
                        sprintf(tmpSig->name,"%s",OElist.Name[obj_subidx]);
                    }
                    else
                        printf("\n");

                    if(t){
                        //Input                                                
                        memcpy(&(tmpSlave->inputs[tmpSlave->nofInputs]),tmpSig,sizeof *tmpSig);
                        tmpSlave->nofInputs++;
                    }
                    else{
                        //Output
                        memcpy(&(tmpSlave->outputs[tmpSlave->nofOutputs]),tmpSig,sizeof *tmpSig);
                        tmpSlave->nofOutputs++;
                    }

                    free(tmpSig);
                    bitoffset += bitlen;
                };
            };
        };
    };
    /* return total found bitlength (PDO) */
    return bsize;
}

//Finds PDOs by CoE
int si_map_sdo(int slave)
{
    int wkc, rdl;
    int retVal = 0;
    uint8 nSM, iSM, tSM;
    int Tsize, outputs_bo, inputs_bo;
    uint8 SMt_bug_add;

    printf("PDO mapping according to CoE :\n");
    SMt_bug_add = 0;
    outputs_bo = 0;
    inputs_bo = 0;
    rdl = sizeof(nSM); nSM = 0;
    /* read SyncManager Communication Type object count */
    wkc = ec_SDOread(slave, ECT_SDO_SMCOMMTYPE, 0x00, FALSE, &rdl, &nSM, EC_TIMEOUTRXM);
    /* positive result from slave ? */
    if ((wkc > 0) && (nSM > 2))
    {
        /* make nSM equal to number of defined SM */
        nSM--;
        /* limit to maximum number of SM defined, if true the slave can't be configured */
        if (nSM > EC_MAXSM)
            nSM = EC_MAXSM;
        /* iterate for every SM type defined */
        for (iSM = 2 ; iSM <= nSM ; iSM++)
        {
            rdl = sizeof(tSM); tSM = 0;
            /* read SyncManager Communication Type */
            wkc = ec_SDOread(slave, ECT_SDO_SMCOMMTYPE, iSM + 1, FALSE, &rdl, &tSM, EC_TIMEOUTRXM);
            if (wkc > 0)
            {
                if((iSM == 2) && (tSM == 2)) // SM2 has type 2 == mailbox out, this is a bug in the slave!
                {
                    SMt_bug_add = 1; // try to correct, this works if the types are 0 1 2 3 and should be 1 2 3 4
                    printf("Activated SM type workaround, possible incorrect mapping.\n");
                }
                if(tSM)
                    tSM += SMt_bug_add; // only add if SMt > 0

                if (tSM == 3) // outputs
                {
                    /* read the assign RXPDO */
                    printf("  SM%1d outputs\n     addr b   index: sub bitl data_type    name\n", iSM);
                    Tsize = si_PDOassign(slave, ECT_SDO_PDOASSIGN + iSM, (int)(ec_slave[slave].outputs - (uint8 *)&IOmap[0]), outputs_bo, 0);
                    outputs_bo += Tsize;
                }
                if (tSM == 4) // inputs
                {
                    /* read the assign TXPDO */
                    printf("  SM%1d inputs\n     addr b   index: sub bitl data_type    name\n", iSM);
                    Tsize = si_PDOassign(slave, ECT_SDO_PDOASSIGN + iSM, (int)(ec_slave[slave].inputs - (uint8 *)&IOmap[0]), inputs_bo, 1);
                    inputs_bo += Tsize;
                }
            }
        }
    }

    /* found some I/O bits ? */
    if ((outputs_bo > 0) || (inputs_bo > 0))
        retVal = 1;
    return retVal;
}

void si_sdo(int cnt)
{
    int i, j;

    ODlist.Entries = 0;
    memset(&ODlist, 0, sizeof(ODlist));
    if( ec_readODlist(cnt, &ODlist))
    {
        printf(" CoE Object Description found, %d entries.\n",ODlist.Entries);
        for( i = 0 ; i < ODlist.Entries ; i++)
        {
            ec_readODdescription(i, &ODlist);
            while(EcatError) printf("%s", ec_elist2string());
            printf(" Index: %4.4x Datatype: %4.4x Objectcode: %2.2x Name: %s\n",
                ODlist.Index[i], ODlist.DataType[i], ODlist.ObjectCode[i], ODlist.Name[i]);
            memset(&OElist, 0, sizeof(OElist));
            ec_readOE(i, &ODlist, &OElist);
            while(EcatError) printf("%s", ec_elist2string());
            for( j = 0 ; j < ODlist.MaxSub[i]+1 ; j++)
            {
                if ((OElist.DataType[j] > 0) && (OElist.BitLength[j] > 0))
                {
                    printf("  Sub: %2.2x Datatype: %4.4x Bitlength: %4.4x Obj.access: %4.4x Name: %s\n",
                        j, OElist.DataType[j], OElist.BitLength[j], OElist.ObjAccess[j], OElist.Name[j]);
                    if ((OElist.ObjAccess[j] & 0x0007))
                    {
                        printf("          Value :%s\n", SDO2string(cnt, ODlist.Index[i], j, OElist.DataType[j]));
                    }
                }
            }
        }
    }
    else
    {
        while(EcatError) printf("%s", ec_elist2string());
    }
}

int si_siiPDO(uint16 slave, uint8 t, int mapoffset, int bitoffset)
{
    uint16 a , w, c, e, er, Size;
    uint8 eectl;
    uint16 obj_idx;
    uint8 obj_subidx;
    uint8 obj_name;
    uint8 obj_datatype;
    uint8 bitlen;
    int totalsize;
    ec_eepromPDOt eepPDO;
    ec_eepromPDOt *PDO;
    int abs_offset, abs_bit;
    char str_name[EC_MAXNAME + 1];

    eectl = ec_slave[slave].eep_pdi;
    Size = 0;
    totalsize = 0;
    PDO = &eepPDO;
    PDO->nPDO = 0;
    PDO->Length = 0;
    PDO->Index[1] = 0;
    for (c = 0 ; c < EC_MAXSM ; c++) PDO->SMbitsize[c] = 0;
    if (t > 1)
        t = 1;
    PDO->Startpos = ec_siifind(slave, ECT_SII_PDO + t);
    if (PDO->Startpos > 0)
    {
        a = PDO->Startpos;
        w = ec_siigetbyte(slave, a++);
        w += (ec_siigetbyte(slave, a++) << 8);
        PDO->Length = w;
        c = 1;
        /* traverse through all PDOs */
        do
        {
            PDO->nPDO++;
            PDO->Index[PDO->nPDO] = ec_siigetbyte(slave, a++);
            PDO->Index[PDO->nPDO] += (ec_siigetbyte(slave, a++) << 8);
            PDO->BitSize[PDO->nPDO] = 0;
            c++;
            /* number of entries in PDO */
            e = ec_siigetbyte(slave, a++);
            PDO->SyncM[PDO->nPDO] = ec_siigetbyte(slave, a++);
            a++;
            obj_name = ec_siigetbyte(slave, a++);
            a += 2;
            c += 2;
            if (PDO->SyncM[PDO->nPDO] < EC_MAXSM) /* active and in range SM? */
            {
                str_name[0] = 0;
                if(obj_name)
                  ec_siistring(str_name, slave, obj_name);

                if (t) //Outputs
                  printf("  SM%1d RXPDO 0x%4.4X %s\n", PDO->SyncM[PDO->nPDO], PDO->Index[PDO->nPDO], str_name);
                else
                  printf("  SM%1d TXPDO 0x%4.4X %s\n", PDO->SyncM[PDO->nPDO], PDO->Index[PDO->nPDO], str_name);
                printf("     addr b   index: sub bitl data_type    name\n");
                /* read all entries defined in PDO */
                for (er = 1; er <= e; er++)
                {
                    c += 4;
                    obj_idx = ec_siigetbyte(slave, a++);
                    obj_idx += (ec_siigetbyte(slave, a++) << 8);
                    obj_subidx = ec_siigetbyte(slave, a++);
                    obj_name = ec_siigetbyte(slave, a++);
                    obj_datatype = ec_siigetbyte(slave, a++);
                    bitlen = ec_siigetbyte(slave, a++);
                    abs_offset = mapoffset + (bitoffset / 8);
                    abs_bit = bitoffset % 8;

                    PDO->BitSize[PDO->nPDO] += bitlen;
                    a += 2;

                    /* skip entry if filler (0x0000:0x00) */
                    if(obj_idx || obj_subidx)
                    {
                        str_name[0] = 0;
                        if(obj_name)
                            ec_siistring(str_name, slave, obj_name);                    

                        printf("  [0x%4.4X.%1d] 0x%4.4X:0x%2.2X 0x%2.2X", abs_offset, abs_bit, obj_idx, obj_subidx, bitlen);
                        printf(" %-12s %s\n", dtype2string(obj_datatype), str_name);

                        struct Signal *tmpSig = (struct Signal*)malloc(sizeof(struct Signal));    

                        tmpSig->abs_offset = abs_offset;
                        tmpSig->abs_bit = abs_bit;
                        tmpSig->bitlen = bitlen;

                        sprintf(tmpSig->type,"%s",dtype2string(obj_datatype));
                        sprintf(tmpSig->name,"%s",str_name);

                        struct Slave *tmpSlave = &slaves[slave];   
                        if(t == 0){
                            //Input                                                
                            memcpy(&(tmpSlave->inputs[tmpSlave->nofInputs]),tmpSig,sizeof *tmpSig);
                            tmpSlave->nofInputs++;
                        }
                        else{
                            //Output
                            memcpy(&(tmpSlave->outputs[tmpSlave->nofOutputs]),tmpSig,sizeof *tmpSig);
                            tmpSlave->nofOutputs++;
                        }
                        free(tmpSig);
                    }
                    bitoffset += bitlen;
                    totalsize += bitlen;
                }
                PDO->SMbitsize[ PDO->SyncM[PDO->nPDO] ] += PDO->BitSize[PDO->nPDO];
                Size += PDO->BitSize[PDO->nPDO];
                c++;
            }
            else /* PDO deactivated because SM is 0xff or > EC_MAXSM */
            {
                c += 4 * e;
                a += 8 * e;
                c++;
            }
            if (PDO->nPDO >= (EC_MAXEEPDO - 1)) c = PDO->Length; /* limit number of PDO entries in buffer */
        }
        while (c < PDO->Length);
    }
    if (eectl) ec_eeprom2pdi(slave); /* if eeprom control was previously pdi then restore */
    return totalsize;
}

int si_map_sii(int slave)
{
    int retVal = 0;
    int Tsize, outputs_bo, inputs_bo;

    printf("PDO mapping according to SII :\n");

    outputs_bo = 0;
    inputs_bo = 0;
    /* read the assign RXPDOs (outputs) */
    Tsize = si_siiPDO(slave, 1, (int)(ec_slave[slave].outputs - (uint8*)&IOmap), outputs_bo );
    outputs_bo += Tsize;
    /* read the assign TXPDOs (inputs) */
    Tsize = si_siiPDO(slave, 0, (int)(ec_slave[slave].inputs - (uint8*)&IOmap), inputs_bo );
    inputs_bo += Tsize;
    /* found some I/O bits ? */
    if ((outputs_bo > 0) || (inputs_bo > 0))
        retVal = 1;
    return retVal;
}

void slaveinfo(char *ifname)
{
    int cnt, i, j, nSM;
    uint16 ssigen;
    int expectedWKC;

    printf("Starting slaveinfo\n");

    /* initialise SOEM, bind socket to ifname */
    if (ec_init(ifname))
    {
        printf("ec_init on %s succeeded.\n",ifname);
        /* find and auto-config slaves */
        if ( ec_config(FALSE, &IOmap) > 0 )
        {
            ec_configdc();
            while(EcatError) printf("%s", ec_elist2string());
            printf("%d slaves found and configured.\n",ec_slavecount);
            
            expectedWKC = (ec_group[0].outputsWKC * 2) + ec_group[0].inputsWKC;
            printf("Calculated workcounter %d\n", expectedWKC);
            
            /* wait for all slaves to reach SAFE_OP state */
            ec_statecheck(0, EC_STATE_SAFE_OP,  EC_TIMEOUTSTATE * 3);
            if (ec_slave[0].state != EC_STATE_SAFE_OP )
            {
                printf("Not all slaves reached safe operational state.\n");
                ec_readstate();
                for(i = 1; i<=ec_slavecount ; i++)
                {
                    if(ec_slave[i].state != EC_STATE_SAFE_OP)
                    {
                        printf("Slave %d State=%2x StatusCode=%4x : %s\n",
                        i, ec_slave[i].state, ec_slave[i].ALstatuscode, ec_ALstatuscode2string(ec_slave[i].ALstatuscode));
                    }
                }
            }


            ec_readstate();
            for( cnt = 1 ; cnt <= ec_slavecount ; cnt++)
            {  
                printf("\nSlave:%d\n Name:%s\n Output size: %dbits\n Input size: %dbits\n", cnt, ec_slave[cnt].name, ec_slave[cnt].Obits, ec_slave[cnt].Ibits);


                sprintf(slaves[cnt].name,"%s",ec_slave[cnt].name);             
                /*printf("\nSlave:%d\n Name:%s\n Output size: %dbits\n Input size: %dbits\n State: %d\n Delay: %d[ns]\n Has DC: %d\n",
                      cnt, ec_slave[cnt].name, ec_slave[cnt].Obits, ec_slave[cnt].Ibits,
                      ec_slave[cnt].state, ec_slave[cnt].pdelay, ec_slave[cnt].hasdc);
                if (ec_slave[cnt].hasdc) printf(" DCParentport:%d\n", ec_slave[cnt].parentport);
                printf(" Activeports:%d.%d.%d.%d\n", (ec_slave[cnt].activeports & 0x01) > 0 ,
                                             (ec_slave[cnt].activeports & 0x02) > 0 ,
                                             (ec_slave[cnt].activeports & 0x04) > 0 ,
                                             (ec_slave[cnt].activeports & 0x08) > 0 );
                printf(" Configured address: %4.4x\n", ec_slave[cnt].configadr);
                printf(" Man: %8.8x ID: %8.8x Rev: %8.8x\n", (int)ec_slave[cnt].eep_man, (int)ec_slave[cnt].eep_id, (int)ec_slave[cnt].eep_rev);
                for(nSM = 0 ; nSM < EC_MAXSM ; nSM++)
                {
                   if(ec_slave[cnt].SM[nSM].StartAddr > 0)
                      printf(" SM%1d A:%4.4x L:%4d F:%8.8x Type:%d\n",nSM, ec_slave[cnt].SM[nSM].StartAddr, ec_slave[cnt].SM[nSM].SMlength,
                             (int)ec_slave[cnt].SM[nSM].SMflags, ec_slave[cnt].SMtype[nSM]);
                }
                for(j = 0 ; j < ec_slave[cnt].FMMUunused ; j++)
                {
                   printf(" FMMU%1d Ls:%8.8x Ll:%4d Lsb:%d Leb:%d Ps:%4.4x Psb:%d Ty:%2.2x Act:%2.2x\n", j,
                           (int)ec_slave[cnt].FMMU[j].LogStart, ec_slave[cnt].FMMU[j].LogLength, ec_slave[cnt].FMMU[j].LogStartbit,
                           ec_slave[cnt].FMMU[j].LogEndbit, ec_slave[cnt].FMMU[j].PhysStart, ec_slave[cnt].FMMU[j].PhysStartBit,
                           ec_slave[cnt].FMMU[j].FMMUtype, ec_slave[cnt].FMMU[j].FMMUactive);
                }
                printf(" FMMUfunc 0:%d 1:%d 2:%d 3:%d\n",
                         ec_slave[cnt].FMMU0func, ec_slave[cnt].FMMU2func, ec_slave[cnt].FMMU2func, ec_slave[cnt].FMMU3func);
                printf(" MBX length wr: %d rd: %d MBX protocols : %2.2x\n", ec_slave[cnt].mbx_l, ec_slave[cnt].mbx_rl, ec_slave[cnt].mbx_proto);
                ssigen = ec_siifind(cnt, ECT_SII_GENERAL);
                77SII general section
                if (ssigen)
                {
                   ec_slave[cnt].CoEdetails = ec_siigetbyte(cnt, ssigen + 0x07);
                   ec_slave[cnt].FoEdetails = ec_siigetbyte(cnt, ssigen + 0x08);
                   ec_slave[cnt].EoEdetails = ec_siigetbyte(cnt, ssigen + 0x09);
                   ec_slave[cnt].SoEdetails = ec_siigetbyte(cnt, ssigen + 0x0a);
                   if((ec_siigetbyte(cnt, ssigen + 0x0d) & 0x02) > 0)
                   {
                      ec_slave[cnt].blockLRW = 1;
                      ec_slave[0].blockLRW++;
                   }
                   ec_slave[cnt].Ebuscurrent = ec_siigetbyte(cnt, ssigen + 0x0e);
                   ec_slave[cnt].Ebuscurrent += ec_siigetbyte(cnt, ssigen + 0x0f) << 8;
                   ec_slave[0].Ebuscurrent += ec_slave[cnt].Ebuscurrent;
                }
                printf(" CoE details: %2.2x FoE details: %2.2x EoE details: %2.2x SoE details: %2.2x\n",
                        ec_slave[cnt].CoEdetails, ec_slave[cnt].FoEdetails, ec_slave[cnt].EoEdetails, ec_slave[cnt].SoEdetails);
                printf(" Ebus current: %d[mA]\n only LRD/LWR:%d\n",
                        ec_slave[cnt].Ebuscurrent, ec_slave[cnt].blockLRW);
                */

                //Get PDOs
                //if ((ec_slave[cnt].mbx_proto & 0x04))
                //    si_sdo(cnt);
            
                if (ec_slave[cnt].mbx_proto & 0x04)
                    si_map_sdo(cnt);
                else
                    si_map_sii(cnt);      //Digital signals EL2004 EL1004      
            }

            int m;

            cJSON *jsonroot;
            cJSON *jsonslaves;

            jsonroot = cJSON_CreateObject();
            cJSON_AddItemToObject(jsonroot, "slaves", jsonslaves=cJSON_CreateArray());
         
            for(m = 0; m < 10 ;m++){
                if(strcmp(slaves[m].name,"")){
                    cJSON *tmpjsonslave;
                    cJSON_AddItemToArray(jsonslaves, tmpjsonslave=cJSON_CreateObject());

                    cJSON_AddStringToObject(tmpjsonslave, "name", slaves[m].name);

                    int n;
                    cJSON *jsoninputs;
                    cJSON_AddItemToObject(tmpjsonslave, "inputs", jsoninputs=cJSON_CreateArray());
                    for(n = 0; n < slaves[m].nofInputs;n++){
                        cJSON *tmpjsonsignal;
                        cJSON_AddItemToArray(jsoninputs, tmpjsonsignal=cJSON_CreateObject());
                        cJSON_AddNumberToObject(tmpjsonsignal, "bitlength", slaves[m].inputs[n].bitlen);
                        cJSON_AddNumberToObject(tmpjsonsignal, "offsetbyte", slaves[m].inputs[n].abs_offset);
                        cJSON_AddNumberToObject(tmpjsonsignal, "offsetbit", slaves[m].inputs[n].abs_bit);
                        cJSON_AddStringToObject(tmpjsonsignal, "type", slaves[m].inputs[n].type);
                        cJSON_AddStringToObject(tmpjsonsignal, "name", slaves[m].inputs[n].name);
                        printf("Slave: %d (%s), Input: %d, Bitlength: %d, Offsetbyte: %d, Offsetbit: %d, Type: %s, Name: %s\n",m,slaves[m].name,n,slaves[m].inputs[n].bitlen,slaves[m].inputs[n].abs_offset,slaves[m].inputs[n].abs_bit,slaves[m].inputs[n].type,slaves[m].inputs[n].name);
                    }

                    cJSON *jsonoutputs;
                    cJSON_AddItemToObject(tmpjsonslave, "outputs", jsonoutputs=cJSON_CreateArray());
                    for(n = 0; n < slaves[m].nofOutputs;n++){
                        cJSON *tmpjsonsignal;
                        cJSON_AddItemToArray(jsonoutputs, tmpjsonsignal=cJSON_CreateObject());
                        cJSON_AddNumberToObject(tmpjsonsignal, "bitlength", slaves[m].outputs[n].bitlen);
                        cJSON_AddNumberToObject(tmpjsonsignal, "offsetbyte", slaves[m].outputs[n].abs_offset);
                        cJSON_AddNumberToObject(tmpjsonsignal, "offsetbit", slaves[m].outputs[n].abs_bit);
                        cJSON_AddStringToObject(tmpjsonsignal, "type", slaves[m].outputs[n].type);
                        cJSON_AddStringToObject(tmpjsonsignal, "name", slaves[m].outputs[n].name);
                        printf("Slave: %d (%s), Output: %d, Bitlength: %d, Offsetbyte: %d, Offsetbit: %d, Type: %s, Name: %s\n",m,slaves[m].name,n,slaves[m].outputs[n].bitlen,slaves[m].outputs[n].abs_offset,slaves[m].outputs[n].abs_bit,slaves[m].outputs[n].type,slaves[m].outputs[n].name);
                    }
                }
            //else{
            //    printf("End of array or gap in array")
            //    break;
            //}
            }

            MQTTClient client;
            MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;
            int rc = 0;

            MQTTClient_create(&client, ADDRESS, CLIENTID, MQTTCLIENT_PERSISTENCE_NONE, NULL);
            conn_opts.keepAliveInterval = 20;
            conn_opts.cleansession = 1;
            conn_opts.username = "marcus";
            conn_opts.password = "test";

            if((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
            {
              printf("Failed to connect, return code %d. %s %s\n", rc, str_date, str_time);
              return;
            }

            char *out;
            out=cJSON_PrintUnformatted(jsonroot);
            cJSON_Delete(jsonroot);

            MQTTClient_message pubmsg = MQTTClient_message_initializer;
            //char sval[10];
            //sprintf(sval, "%2.2x,%2.2x", *(ec_slave[0].outputs), *(ec_slave[0].outputs+1));
            pubmsg.payload = out;
            pubmsg.payloadlen = strlen(out);
            pubmsg.qos = 0;
            pubmsg.retained = 0;
            MQTTClient_deliveryToken token;
            MQTTClient_publishMessage(client, "/ethercat/units", &pubmsg, &token);
            rc = MQTTClient_waitForCompletion(client, token, TIMEOUT);

            MQTTClient_disconnect(client, 10000);
            MQTTClient_destroy(&client);

            printf("%s\n",out);
            free(out);
        }
        else
        {
            printf("No slaves found!\n");
        }
        printf("End slaveinfo, close socket\n");
        /* stop SOEM, close socket */
        ec_close();
    }
    else
    {
      printf("No socket connection on %s\nExcecute as root\n",ifname);
    }
}

int main(int argc, char *argv[])
{    
    printf("SOEM (Simple Open EtherCAT Master)\nSimple test\n");
    if(argc > 1)
    {
        printf("Scanning connected units.");
        ec_adaptert * adapter = NULL;

        slaveinfo(argv[1]);
        /* create thread to handle slave error handling in OP and MQTT */
        //pthread_create( &thread1, NULL, (void *) &ecatcheck, (void*) &ctime);   
        osal_thread_create(&thread1, 128000, &ecatcheck, (void*) &ctime);
        osal_thread_create(&mqttthread, 128000, &sendmqtt, (void*) &ctime);
        /* start cyclic part */
        simpletest(argv[1]);
    }                                                
    else{
        printf("Usage: simple_test ifname1\nifname = eth0 for example\n");
    }            
    printf("End program\n");
    return (0);           
}
