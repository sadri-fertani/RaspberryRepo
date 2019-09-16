# -*- coding: utf-8 -*-
import bme280
import time
 
while True: 
    temperature,pression,humidite = bme280.readBME280All()
    print "Temp : ", temperature, "°C \t P : ", pression, "hPa \t HR : ", humidite, "%"
    time.sleep(2)