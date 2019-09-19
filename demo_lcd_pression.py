import RPi.GPIO as GPIO
import dht11
import datetime
import lcddriver
import time

# initialize GPIO
GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)

# read data using pin 17
instance = dht11.DHT11(pin=17)

# Load the driver and set it to "display"
# If you use something from the driver library use the "display." prefix first
display = lcddriver.lcd()

# Main body of code
try:
    while True:
        result = instance.read()
        if result.is_valid():
            display.lcd_display_string(
                "Temp.: %-3.1f C" % result.temperature, 1)
            display.lcd_display_string(
                "Humidity: %-3.1f %%" % result.humidity, 2)

        time.sleep(2)

# If there is a KeyboardInterrupt (when you press ctrl+c), exit the program and cleanup
except KeyboardInterrupt:
    print("Cleaning up!")
    display.lcd_clear()
    GPIO.cleanup()
