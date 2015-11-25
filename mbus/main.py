#!/usr/bin/python
# -*- coding: utf-8 -*-

import requests
from requests.auth import HTTPBasicAuth
import json
import time
import os
import urllib2
import base64
import paho.mqtt.client as mqtt

def sendRPC(url, user, passw, **kwargs):
    data = {
        "jsonrpc":"2.0",
        "id":1
    }

    for key, value in kwargs.iteritems():
        data[key] = value

    headers = {
        "Content-Type":"application/json-rpc"
    }

    res = requests.post(url,
        auth=HTTPBasicAuth(user, passw),
        data=json.dumps(data),
        headers=headers)

    return json.dumps(res.json())

if __name__ == "__main__":
    try:
        mqttc = mqtt.Client("mbusclient123")
        mqttc.username_pw_set("marcus", password="test")
        mqttc.connect("localhost",)
        mqttc.loop_start()
    except:
        pass
    while True:
        try:
            #Used for find fiding the .credentials file when run from CRON.
            scriptDirectory = os.path.dirname(os.path.realpath(__file__))
            credentialsFilePath = os.path.join(scriptDirectory, ".credentials")
            with open(credentialsFilePath, 'r') as f:
                doc = {}
                doc["timestamp"]=int(time.time()*1000)
                for line in f:
                    file_data = line
                    creds = file_data.split(',')
                    url = creds[0]
                    user = creds[1]
                    passw = creds[2].replace('\n','')

                    all = sendRPC(url, user, passw, method="pdb.browse")
                    all = json.loads(all)
                    allpids = []
                    allchannels = {}
                    for channel in all["result"]["points"]:
                        allpids.append(channel["pid"])
                        allchannels[channel["pid"]]={
                            "unit":channel["attr"],
                            "desc":channel["desc"]
                        }

                    elm1 = sendRPC(url, user, passw, method="pdb.getvalue",params=allpids)
                    elm1dict = json.loads(elm1)

                    #print elm1dict

                    todbdict = {}
                    for pid in elm1dict["result"]["points"]:
                        todbdict[pid["pid"]]=pid["value"]
                        allchannels[pid["pid"]]["value"] = pid["value"]
                        allchannels[pid["pid"]]["time"] = elm1dict["result"]["timet"]

                    todbdict["time"]=elm1dict["result"]["timet"]

                    #print todbdict

                    points = []
                    for pid in allchannels:
                        pido = allchannels[pid]
                        doc[pid] = pido["value"]
                        point = ''.join([pido["desc"].encode("utf-8"),",unit=",pido["unit"].encode("utf-8"),",pid=",pid.encode("utf-8")," value=",str(pido["value"])," ",str(pido["time"])])
                        points.append(point)
                    psend = '\n'.join(points)

                    print points

                    mqttc.publish("/mbus/data", json.dumps(todbdict), retain=True)
                    print "Data sent to mqtt."
        except KeyError as ke:
            print "Key error",ke
            pass
        except requests.exceptions.ConnectionError as ce:
            print "Connection error",ce
            pass
        except:
            #print "Error opening credentials file."
            pass
        time.sleep(5);
