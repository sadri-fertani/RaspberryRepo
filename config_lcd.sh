#!/bin/bash
if [ "$(id -u)" != "0" ]; then
	echo "Please re-run as sudo."
	exit 1
fi

echo "Automated Installer Program For I2C LCD Screens"
echo "Installer by Ryanteck LTD. Cloned and tweaked by Matthew Timmons-Brown for The Raspberry Pi Guy YouTube tutorial"
echo "Updating APT & Installing python-smbus, if password is asked by sudo please enter it"
apt-get update
apt-get install python-smbus -y
echo "Should now be installed, now checking revision"
revision=`python -c "import RPi.GPIO as GPIO; print GPIO.RPI_REVISION"`

echo "Now overwriting modules & blacklist. This will enable i2c Pins"
cp lcdConfigs/modules /etc/
cp lcdConfigs/raspi-blacklist.conf /etc/modprobe.d/
printf "dtparam=i2c_arm=1\n" >> /boot/config.txt

echo "Should be now all finished. Please press any key to now reboot."
read -n1 -s
sudo reboot