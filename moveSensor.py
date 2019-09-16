import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
capteur = 7

GPIO.setup(capteur, GPIO.IN)

print("Demarrage du capteur")

time.sleep(2)

print("Capteur pret a detecte un mouvement")

while True:
    if GPIO.input(capteur):
        print("Mouvement detected")
        time.sleep(2)
    time.sleep(0.1)
