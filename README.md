Calendar
========================

Calendar is a HTML5/JavaScript web application.

### Used technologies

* Server part: 
  - NoSQL database MongoDB hosted on MongoHQ
  - RESTFul Services with Node.js
  
* Client part: 
  - HTML
  - CSS
  - jQuery 
  - jQuery UI
  - Underscore.js

### Server documentation 

The Calendar server currently runs on nodejs v0.10.31 and requires the latest versions of the following npm libraries: 

```
express
mongodb
```
This is not the last version of the server, it's still in the process of debugging.

### Client documentation

* To run the Calendar application there are two possible ways :

Open the file "persister.js" there are two urls:
 - first one is for the online server url: "http://my-calendar.jit.su/task-"/n
In order to run the Calendar through the online server : start the index.html

 - local server url: "http://localhost:3000/task-"\n
In order to run the Calendar through the local server type: node server.js
 
* Support the following browsers:
 - Chrome
 - Firefox
 - IE 10+
 - Opera
