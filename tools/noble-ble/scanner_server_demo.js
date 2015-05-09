var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);  
var scanner = io.of('/scanner'); 
var exec = require('exec-sync');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});

var name;
var status;
var phone;
var EXIT_GRACE_PERIOD = 10000; // milliseconds
var inRange = [];


scanner.on('connection', function(socket) {
 
    console.log('Scanner Connected');
    
    socket.on('uuid', function(uuid) {
        name = uuid;
        var entered = !inRange[uuid];

        if (entered) {
          inRange[uuid] = {
            lastSeen: Date.now()
          };
          exec(['node email_demo.js ' +name +' ' +'Arrived' +' ' +phone]);
        }

        inRange[uuid].lastSeen = Date.now();
          
        console.log('uuid: ' + uuid);
    });

    socket.on('phone_no', function(phone_no) { 
        phone = phone_no; 
        console.log('phone: ' + phone);
    }); 

    socket.on('rssi', function(rssi) { 
        console.log('rssi: ' + rssi);
        status = rssi; 
//        exec(['node email_demo.js ' +name +' ' +status]);
    }); 
  
    socket.on('disconnect', function() {
        console.log('Scanner Disconnected');
    });
});
 
http.listen(6000, function() {
    console.log('listening on *:6000');
});

setInterval(function() {
  for (var uuid in inRange) {
    if (inRange[uuid].lastSeen < (Date.now() - EXIT_GRACE_PERIOD)) {

      console.log('uuid: ' +uuid +' exited ' +new Date());
      exec(['node email_demo.js ' +uuid +' ' +'Left' +' ' +phone]);
      db.collection('userlist').findAndModify(
        {childname:uuid}, 
        [['childname', 1]],
        {$set:{status:'off site'}}, 
        {new:true}, 
        function(err, result) {}
      );

      delete inRange[uuid];
    }
  }
}, EXIT_GRACE_PERIOD / 2);
