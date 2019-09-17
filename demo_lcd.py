# Simple string program. Writes and updates strings.
# Demo program for the I2C 16x2 Display from Ryanteck.uk
# Created by Matthew Timmons-Brown for The Raspberry Pi Guy YouTube channel

# Import necessary libraries for communication and display use
import lcddriver
import time

# Load the driver and set it to "display"
# If you use something from the driver library use the "display." prefix first
display = lcddriver.lcd()

# Main body of code
try:
    while True:
        # Remember that your sentences can only be 16 characters long!
        print("Writing to display")
        # Write line of text to first line of display
        userInputLine1 = input(
            "Please enter any thing to display on the first line of LCD screen : ")
        display.lcd_display_string(userInputLine1, 1)
        # Write line of text to second line of display
        userInputLine2 = input(
            "Please enter any thing to display on the second line : ")
        display.lcd_display_string(userInputLine2, 2)
        # Give time for the message to be read
        time.sleep(2)
        display.lcd_clear()                               # Clear the display of any data
        # Give time for the message to be read
        time.sleep(0.5)

# If there is a KeyboardInterrupt (when you press ctrl+c), exit the program and cleanup
except KeyboardInterrupt:
    print("Cleaning up!")
    display.lcd_clear()
