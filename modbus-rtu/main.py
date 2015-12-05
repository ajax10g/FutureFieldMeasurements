#!/usr/bin/python
import serial
import modbus_tk
import modbus_tk.defines as cst
from modbus_tk import modbus_rtu
import paho.mqtt.client as mqtt
import time
import json

print "Modbus-RTU driver started."

client = None
master = None
settings = {
    "server_ip": "127.0.0.1",
    "server_port": 1883,
    "server_keep_alive": 30
}

def initializeSerial():
    default_config = {
        "port": "/dev/ttyS2",
        "baudrate": 38400,
        "bytesize": 8,
        "parity": 'E',
        "stopbits": 1,
        "xonxoff": 0
    }
    
    updateSettings(default_config)

def initializeMqtt():
    global client
    client = mqtt.Client()
    #Handle messages
    client.on_message = handle_message 
    client.on_connect = on_connect
    client.connect(settings["server_ip"], settings["server_port"], settings["server_keep_alive"])
    client.loop_start() #Threaded mqtt-loop

    #client.publish("/watercontrol/measurements/", payload=make_data_message(*get_all_data()))
    #client.publish("/watercontrol/command/request/", payload=make_timestamp())

def on_connect(client, userdata, flags, rc):
    client.subscribe("/modbus-rtu/write")
    client.subscribe("/modbus-rtu/read")
    client.subscribe("/modbus-rtu/config")

#modbus exception codes
#ILLEGAL_FUNCTION = 1
#ILLEGAL_DATA_ADDRESS = 2
#ILLEGAL_DATA_VALUE = 3
#SLAVE_DEVICE_FAILURE = 4
#COMMAND_ACKNOWLEDGE = 5
#SLAVE_DEVICE_BUSY = 6
#MEMORY_PARITY_ERROR = 8

#supported modbus functions
#READ_COILS = 1
#READ_DISCRETE_INPUTS = 2
#READ_HOLDING_REGISTERS = 3
#READ_INPUT_REGISTERS = 4
#WRITE_SINGLE_COIL = 5
#WRITE_SINGLE_REGISTER = 6
#READ_EXCEPTION_STATUS = 7
#DIAGNOSTIC = 8
#WRITE_MULTIPLE_COILS = 15
#WRITE_MULTIPLE_REGISTERS = 16
#READ_WRITE_MULTIPLE_REGISTERS = 23
#DEVICE_INFO = 43

#supported block types
#COILS = 1
#DISCRETE_INPUTS = 2
#HOLDING_REGISTERS = 3
#ANALOG_INPUTS = 

def handle_message(client, userdata, msg):
    payload = json.loads(str(msg.payload))
    value = None
    print "Received mqtt-message",msg.topic,str(msg.payload)
    if(msg.topic == "/modbus-rtu/read"):
        for com in payload["commands"]:
            addr = com["addr"]
            reg = com["reg"]
            offset = com["offset"]
            len = com["len"]
            try:
                value = master.execute(addr, reg, offset, len)
                print "Read values from Modbus:",json.dumps(value)
            except modbus_tk.modbus.ModbusError as me:
                client.publish("/modbus-rtu/error",str(me))
            except modbus_tk.modbus.ModbusInvalidResponseError as respe:
                client.publish("/modbus-rtu/error",str(respe))
            except Exception as e:
                print "Failed to read from Modbus",str(e)
                raise
        client.publish("/modbus-rtu/read/response",json.dumps(value))
                        
    elif(msg.topic == "/modbus-rtu/write"):
        for com in payload["commands"]:
            addr = com["addr"]
            reg = com["reg"]
            offset = com["offset"]
            len = com["len"]
            value = com["value"]
            try:
                master.execute(addr, reg, offset, len, output_value=value)
                print "Wrote values to Modbus:",json.dumps(value)
            except modbus_tk.modbus.ModbusError as me:
                client.publish("/modbus-rtu/error",str(me))
            except modbus_tk.modbus.ModbusInvalidResponseError as respe:
                client.publish("/modbus-rtu/error",str(respe))
            except Exception as e:
                print "Failed to write to Modbus",str(e)
                raise
    elif(msg.topic == "/modbus-rtu/config"):
        updateSettings(json.loads(payload))

#Set baud rate, parity, portname etc via MQTT
#1. receive mqtt message with new settings
#2. reinitialize rtu master
#TODO
def updateSettings(config):
    global master
    print "Updating modbus settings:",json.dumps(config)
    master = modbus_rtu.RtuMaster(
        serial.Serial(port=config["port"], baudrate=config["baudrate"], bytesize=config["bytesize"], parity=config["parity"], stopbits=config["stopbits"], xonxoff=config["xonxoff"])
    )
    master.set_timeout(5.0)

#Receive addr,offset,size in bits to read from

def main():
    initializeSerial()
    initializeMqtt()
    while True:
        time.sleep(0.1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        raise
    except KeyError:
        raise
    except Exception as e:
        print str(e)
        raise
