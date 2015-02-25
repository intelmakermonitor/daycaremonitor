var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
var scanner = io.of('/scanner'); 

var BTDevices = ["a4d856039ebf", "ee443390fa9d", "fb738cf43b8a"];

scanner.on('connection', function(socket) {
 
    console.log('Scanner Connected');
    
//    socket.on('deviceData', function(msg) {
    socket.on('uuid', function(uuid) {
        console.log('uuid: ' + uuid);
        //recived message from scanner
        //do some processing here
    });

    socket.on('rssi', function(rssi) { 
        console.log('rssi: ' + rssi); 
        //recived message from scanner 
        //do some processing here
    }); 
  
    socket.on('disconnect', function() {
        console.log('Scanner Disconnected');
    });
});
 
http.listen(3000, function() {
    console.log('listening on *:3000');
});
