import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)
capteur = 36

GPIO.setup(capteur, GPIO.IN)

print("Demarrage du capteur")

time.sleep(1)

print("Capteur pret a detecte un mouvement")

while True:
    if GPIO.input(capteur):
        print("Mouvement detected")
        time.sleep(0.25)
    time.sleep(0.1)
