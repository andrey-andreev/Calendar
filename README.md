Calendar
========================

Calendar is a HTML5/JavaScript web application.

### Used technologies

* Server part: 
  - NoSQL database MongoDB hosted on MongoHQ
  - RESTFul Services with Node.js hosted on Nodejitsu
  
* Client part: 
  - HTML
  - CSS/SASS
  - jQuery 
  - jQuery UI
  - Underscore.js

### Server documentation 

* The Calendar server currently runs on nodejs v0.10.31 and requires the latest versions of the following npm libraries: 

  - express
  - mongoskin
  - async
  - underscore

* This is not the last version of the server. The agenda functionality doesn't work properly and it's in the process of debugging.

### Client documentation

* To run the Calendar application there are two possible ways. In the file "persister.js" there are two urls:
  - first option is through the online server, in that case you have to download only the folder "client" and index.html and start the index.html.

  - in second option you have to download the folder "server" too, in the file "persister.js"  you have to uncomment this url: "http://localhost:3000/task-" and comment this url: "http://my-calendar.jit.su/task-". Then type: node server.js to start the server and start the index.html to run the application.
