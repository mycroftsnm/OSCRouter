# OSCRouter
a simple osc router, with a web gui

# WIP , not ready yet

Clone it, create a venv and install required dependencys (requirements.txt).
U can use PyCharm or another IDE to make things easy.
 Run oscserver.py -c to start the web gui and the osc server, run it without arguments to only start the osc server with latest active preset loaded

recieves an osc message with an int argument and sends a more complex osc message.

Syntaxis for the arguments is: Data Type,Min value,Max value


  example: s,Hello world!,Bye
  
  
  another example: i,3,6
 
 
 If Max value is no set, then the min value always will be send. s,Hello world! will always send Hello world string no matter the value receibed
 


# Features
### Run it on any OS 
- As long as the GUI is a web app, u can run it in any os with a web browser.
### SQL to save an load the presets
### Support of string, int, float and char OSC Type tags

