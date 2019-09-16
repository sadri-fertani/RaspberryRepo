import RPi.GPIO as GPIO
import time
import pygame


def switcher(ledState):
    return GPIO.HIGH if ledState == GPIO.LOW else GPIO.LOW


GPIO.setmode(GPIO.BOARD)

pygame.mixer.init()
pygame.mixer.music.load("./songs/Paid-My-Dues.mp3")
pygame.mixer.music.set_volume(1.0)

bleuLed = 37
redLed = 35
bleuLedState = GPIO.LOW
redLedState = GPIO.HIGH

GPIO.setwarnings(False)  # Disable warnings.

GPIO.setup(bleuLed, GPIO.OUT, initial=bleuLedState)
GPIO.setup(redLed, GPIO.OUT, initial=redLedState)

time.sleep(2)

pygame.mixer.music.play()

while True:
    bleuLedState = switcher(bleuLedState)
    redLedState = switcher(redLedState)

    GPIO.output(bleuLed, bleuLedState)
    GPIO.output(redLed, redLedState)

    # while pygame.mixer.music.get_busy() == True:
    #    pass

    time.sleep(0.5)
