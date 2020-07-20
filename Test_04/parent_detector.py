from gpiozero import MotionSensor
# from picamera import Picamera
import picamera
from datetime import datetime

pir = MotionSensor(12)
# camera = PiCamera()

# camera.capture('home/pi/selfie.png')

with picamera.PiCamera() as camera:
    while True:
        now = (datetime.now())
        filename = "/home/pi/Pictures/{0:%Y}-{0:%m}-{0:%d}-{0:%H}-{0:%M}-{0:%S}.h264".format(now)
        print(filename)
        pir.wait_for_motion()
        print("Mouvement detected")
        camera.start_recording(filename)
        pir.wait_for_no_motion()
        camera.stop_recording()
