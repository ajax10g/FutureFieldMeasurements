import serial
import time
import binascii
import json
import base64
import urllib2
import sys
import paho.mqtt.client as mqtt

docToSend = {}

s = serial.Serial(port='/dev/ttyS1', baudrate=9600, timeout=1)

def command(com):
    s.write(com)
    ans = ""
    char = ""
    while True:
        char = str(s.read())
        if char == '':
            return None
        if char == '\r' and ans == "":
            return None
        if char == '\r':
            return ans
        ans += char
    

def getAll():
    command('R')
    res = []
    #command('R')
    first = command('S')
    if first == None:
        print "No data"
    else:
        res.append(first)

    while True:
        read = command('s')
        if read == None:            
            break;
        else:
            res.append(read)
    command('R')
    return res

def readAllScratch():
    i = 1;    
    first = command('F28') #Family search 0x28    
    readScratch(first)    
    #print i,": ",first," "
    second = ""
    while second != None:
        i += 1
        second = command('f')
        readScratch(second)
        #print i,": ",second," "

def readAllTemps():
    #command('R')
    first = command('F28')
    #command('R')
    readTemp(first)
    second = ""
    while second != None:
        #command('R')
        second = command('f')
        #command('R')
        readTemp(second)

def readAllHum():
    command('R')
    first = command('F26')
    command('R')
    readHum(first)
    second = ""
    while second != None:
        command('R')
        second = command('f')
        command('R')
        readHum(second)

def readAllSoil():
    command('R')
    first = command('F30')
    command('R')
    readSoil(first)
    second = ""
    while second != None:
        command('R')
        second = command('f')
        command('R')
        readHum(second)
	
def readSoil(first=None):
    if first == None:
        print "No connected soil meters"
        return
    else:
        unit = first[len(first)-4:len(first)]
        value = command('W046918FFFF\r')
        command('R')
        tempstr = value[4:6]+value[6:8]
        print "Soil tempstr: ",tempstr
        tempval = (int(tempstr,16) & 0x7FE0) >> 5
        sign = (int(tempstr,16) & 0x8000) >> 15
        soiltemp = 0
        if sign:
            soiltemp = -128+tempval*0.125
        else:
            soiltemp = tempval*0.125
        print "Soil meter temp: ",soiltemp

	command('M')
        value = command('W04690EFFFF\r')
        command('R')
        tempstr = value[4:6]+value[6:8]
        tempval = (int(tempstr,16) & 0x7FF8) >> 3
        sign = (int(tempstr,16) & 0x8000) >> 15
        tempint = 0
        tempext = 0
        
        if sign:
            tempint = -1900 + tempval*0.625
            tempext = -0.064+tempval*0.000015625
        else:
            tempint = tempval*0.625
            tempext = tempval*0.000015625

        if sign:
            perc = (((-0.064+tempval*0.000015625)-(-0.0040625))/(-0.046796875 - (-0.0040625)))*100
        else:
            perc = (((tempval*0.000015625)-0.0040625)/(0.046796875 - 0.0040625))*100

        print "Wetness % (100% = wet, 0% = dry): ",perc
	command('M')
        value = command('W04690CFFFF\r')
        print "Value received: ",value
        command('R')
        tempstr = value[4:6]+value[6:8]
        tempval = (int(tempstr,16) & 0x7FE0) >> 5
        print "Soil meter voltage: (0-4.75V) ",tempval*0.00488

        global docToSend
        docToSend[first] = {'voltV': tempext, 'boardtempC': soiltemp, 'moistperc': perc}

def readScratch(first):
    if first == None:
        return
        #print "No connected DS18B20"
    else:
        #unit = first[len(first)-4:len(first)]
        ans = command('R')
        print "presence:",ans
        ans = command('M')
        print "match:",ans
        ans = command('W0144\r')        
        print "tconv:",ans
        print "Started temperature conversion:",ans
        time.sleep(0.750)        
        #print "Should be 44: ",ans        
        print "Reading scratchpad: ",first
        ans = command('R')
        print "presence:",ans
        ans = command('M')
        print "match:",ans
        value = command('W0ABEFFFFFFFFFFFFFFFFFF\r')
        if value == None:
            print "No answer from unit"
        else:
            #Whole scratchpad
            print "Scratchpad: ",value
            #Temperature
            str = value[4:6]+value[2:4]
            val = (int(str,16) & 0x7FF)
            sign = (int(str,16) & 0x800) >> 11
            temp = 0
            if sign == 1:
                temp = -128+val*0.0625
                print 'Temperature: ',temp,' C'                    
            else:
                temp = val*0.0625
                print 'Temperature: ',temp,' C'

            #Alarm temperature HIGH
            str = value[6:8]
            val = (int(str,16) & 0x7F) << 4
            sign = (int(str,16) & 0x80) >> 7
            temp = 0
            if(val == 0 and sign == 1):
                print 'Temperature Alarm HIGH: ','NOT SET'
            else:
                if sign == 1:
                    temp = -128+val*0.0625
                    print 'Temperature Alarm HIGH: ',temp,' C'                    
                else:
                    temp = val*0.0625
                    print 'Temperature Alarm HIGH: ',temp,' C'

            #Alarm temperature LOW
            str = value[8:10]
            val = (int(str,16) & 0x7F) << 4
            sign = (int(str,16) & 0x80) >> 7
            temp = 0
            if(val == 0 and sign == 1):
                print 'Temperature Alarm LOW: ','NOT SET'           
            else:
                if sign == 1:
                    temp = -128+val*0.0625
                    print 'Temperature Alarm LOW: ',temp,' C'                    
                else:
                    temp = val*0.0625
                    print 'Temperature Alarm LOW: ',temp,' C'  

            #Configuration
            conf = value[10:12]
            #print "Configuration:",conf
            r = (int(conf,16) & (0x6F)) >> 5
            if(r == 0):
                print "Resolution:","9-bits"            
            elif(r == 1):
                print "Resolution:","10-bits"
            elif(r == 2):
                print "Resolution:","11-bits"
            elif(r == 3):
                print "Resolution:","12-bits"

    #command('R')
    #ans = command('W01CC\r')
    #ans = command('W014E\r') #Write scratchpad
    #do write here
    #time.sleep(0.1);
    #ans = command('M')
    #command('AA9000004AF668C28\r')
    #ans = command('W0ABEFFFFFFFFFFFFFFFFFF\r') #Read scratchpad
    #time.sleep(0.1);
    #print ans
    #command('R')

def writeScratch(first):
    print "Writing scratch."
    #com = ''.join(['M',first])
    #print com
    #unit = command(com)
    #print unit    
    #unit = command(com) #Match the incoming unit
    unit = command('M')
    print "Match unit",unit
    #time.sleep(0.1)
    if(unit == None):
        print "Not able to match ROM when writing Scratchpad"
    else:
        #Set resolution to 12-bit
        write = command('W044E80807F\r') 
        print write        
        time.sleep(0.5)
        command('M')
        write = command('W0148\r')
        print write
        time.sleep(0.5)        
    #time.sleep(0.1)
    command('R')    

def readHum(first=None):
    if first == None:
        #print "No connected humidity meters"
        return
    else:
        unit = first[len(first)-4:len(first)]
        value = command('W024E00\r')
        value = command('W0108\r')
        command('R')

        ans = command('M')
        value = command('W0ABE00FFFFFFFFFFFFFFFFFF\r')
        command('R')

        ans = command('M')
        value = command('W01B4\r')
        time.sleep(0.004)
        command('R')

        ans = command('M')
        time.sleep(0.02)
        value = command('W02B800\r')
        command('R')

        ans = command('M')
        value = command('W0ABE00FFFFFFFFFFFFFFFFFF\r')
        command('R')

        voltstr = value[12:14]+value[10:12]
        batvoltval = int(voltstr,16) & 0x3FF
        print 'Battery voltage (',unit,'): ',batvoltval/100.0,' V'

        ans = command('M')
        value = command('W0144\r')
        command('R')
        time.sleep(0.01)

        ans = command('M')
        value = command('W01B4\r')
        time.sleep(0.004)
        command('R')

        ans = command('M')
        time.sleep(0.02)
        value = command('W02B800\r')
        command('R')

        ans = command('M')
        value = command('W0ABE00FFFFFFFFFFFFFFFFFF\r')
        command('R')
        tempstr = value[8:10]+value[6:8]
        tempval = (int(tempstr,16) & 0x7FF8) >> 3
        tempsign = (int(tempstr,16) & 0x8000) >> 15
        temp = 0
        if tempsign:
            temp = -128+tempval*0.03125
            print 'Temperature (',unit,'): ',temp,' C'
        else:
            temp = tempval*0.03125
            print 'Temperature (',unit,'): ',temp,' C'

        voltstr = value[12:14]+value[10:12]
        sensvoltval = int(voltstr,16) & 0x3FF
        print "Sensor voltage (",unit,"): ",sensvoltval/100.0,' V'
        if batvoltval != 0 and (1.0546 - 0.00216*temp) != 0:
            rh = (sensvoltval/float(batvoltval) - 0.16) / 0.0062
            truerh = int(rh / (1.0546 - 0.00216*temp))
        else:
            truerh = -50 #Error condition
        print "Humidity (",unit,"): ",truerh," %RH"

        global docToSend
        docToSend[first] = {'moistRH': truerh, 'tempC': temp, 'voltV': sensvoltval/100.0}

def readTemp(first=None):
    if first == None:
        return
        #print "No connected DS18B20"
    else:
        unit = first[len(first)-4:len(first)]
        #ans = command('R')
        ans = command('M')
        ans = command('W0144\r')
        if ans == None:
            print "No answer from unit"
        elif ans == '44':
            time.sleep(0.75)
            #ans = command('R')
            ans = command('M')
            #ans=first
            if ans == None or ans != first:
                print "Match ROM-command error"
            else:
                value = command('W0ABEFFFFFFFFFFFFFFFFFF\r')
                str = value[4:6]+value[2:4]
                val = int(str,16) & 0x7FF
                sign = (int(str,16) & 0x800) >> 11
                temp = 0
                if sign == 1:
                    temp = -128+val*0.0625
                    print 'Temperature (',unit,'): ',temp,' C'                    
                else:
                    temp = val*0.0625
                    print 'Temperature: (',unit,'): ',temp,' C'
                global docToSend
                if(temp != 85.0):
                    docToSend[first] = {'tempC':temp}               
                else:
                    try:
                        del docToSend[first]
                    except KeyError as e:
                        pass

def calc_CRC_bit (shift_reg, data_bit):
    print data_bit
    fb = (shift_reg & 0x01) ** data_bit;
    shift_reg = shift_reg >> 1;     
    if fb == 1:
       shift_reg = shift_reg ** 0x8C
    return shift_reg

def calccrc(str):
    slen = len(str)
    crcval = (str[slen-2:slen]).decode('hex')
    shift_reg = 0
    for i in xrange(0,len(str)-2,2):
        calc = ord((str[i:i+2]).decode('hex'))
        for j in xrange(0,8):
            print j
            shift_reg = calc_CRC_bit(shift_reg,calc & (1 << j))
    print "CRC done", shift_reg

def main():    
    mqttc = mqtt.Client("1-wireclient123")
    mqttc.username_pw_set("marcus", password="test")
    mqttc.connect("localhost",)
    mqttc.loop_start()    
    while True:
        try:            
            print getAll()
            readAllTemps()            
            if docToSend:
                mqttc.publish("/1-wire/data", json.dumps(docToSend), retain=False)
        except KeyboardInterrupt:
            raise
        except:
            pass

if __name__ == '__main__':
  main()
