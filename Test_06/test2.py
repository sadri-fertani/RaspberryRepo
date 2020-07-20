# test de la caméra picamera.py
# importer les paquets requis pour la Picaméra
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2

# initialisation des paramètres pour la capture
camera = PiCamera()
camera.resolution = (640, 480)
camera.framerate = 32
camera.rotation = 180
rawCapture = PiRGBArray(camera, size=(640, 480))

# temps réservé pour l'autofocus
time.sleep(0.1)

# capture du flux vidéo
for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):

    # recupère à l'aide de Numpy le cadre de l'image, pour l'afficher ensuite à l'écran
    image = frame.array

    # show the frame
    cv2.imshow("Frame", image)
    key = cv2.waitKey(1) & 0xFF

    # initialisation du flux
    rawCapture.truncate(0)
    
    # si la touche q du clavier est appuyée, on sort de la boucle
    if key == ord("q"):
        break
    