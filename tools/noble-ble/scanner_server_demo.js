var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);  
var scanner = io.of('/scanner'); 
var exec = require('exec-sync');

var name;
var status;

scanner.on('connection', function(socket) {
 
    console.log('Scanner Connected');
    
    socket.on('uuid', function(uuid) {
        name = uuid;
        console.log('uuid: ' + uuid);
    });

    socket.on('rssi', function(rssi) { 
        console.log('rssi: ' + rssi);
        status = rssi; 
        exec(['node email_demo.js ' +name +' ' +status]);
    }); 
  
    socket.on('disconnect', function() {
        console.log('Scanner Disconnected');
    });
});
 
http.listen(6000, function() {
    console.log('listening on *:6000');
});


