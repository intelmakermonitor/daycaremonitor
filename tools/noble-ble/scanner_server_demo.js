var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sleep = require('sleep');
var m = require('mraa');
var bussPin = new m.Gpio(8); //setup digital read on pin 7
bussPin.dir(m.DIR_OUT); //set the gpio direction to output
bussPin.write(0); //set the digital pin to low
  
var scanner = io.of('/scanner'); 

var BTDevices = ["a4d856039ebf", "ee443390fa9d", "fb738cf43b8a"];

var in_action = 0;
var exec = require('exec-sync');

scanner.on('connection', function(socket) {
 
    console.log('Scanner Connected');
    
    socket.on('uuid', function(uuid) {
        console.log('uuid: ' + uuid);
//        bussPin.write(1); //set the digital pin high to light LED
//        sleep.usleep(500000);
//        bussPin.write(0); //set the digital pin to low
         var child = exec('node demo.js');
        //recived message from scanner
        //do some processing here
    });

    socket.on('rssi', function(rssi) { 
        console.log('rssi: ' + rssi); 
    }); 
  
    socket.on('disconnect', function() {
        console.log('Scanner Disconnected');
    });
});
 
http.listen(3000, function() {
    console.log('listening on *:3000');
});


