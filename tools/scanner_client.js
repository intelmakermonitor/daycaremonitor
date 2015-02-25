var BTDevices = ["a4d856039ebf", "ee443390fa9d", "fb738cf43b8a"];

var noble = require('noble');
 
//replace localhost with your server's IP;
var socket = require('socket.io-client')('http://localhost:3000/scanner');
 
//replace with your hardware address
//var addressToTrack = 'ee443390fa9d'; // estimote
//var addressToTrack = 'a4d856039ebf'; // gimbal
var addressToTrack = 'fb738cf43b8a'; // yi estimote
socket.on('connect', function(){  
  console.log('connected to server');
});
 
noble.on('discover', function(peripheral){
  for (var i = 0; i < BTDevices.length; i++) {
    if(peripheral.uuid == BTDevices[i]){
      console.log('deviceData-kevin', {mac: peripheral.uuid, rssi:peripheral.rssi});
//      socket.emit('deviceData', {mac: peripheral.uuid, rssi:peripheral.rssi});
      socket.emit('uuid', peripheral.uuid);
      socket.emit('rssi', peripheral.rssi);
    }
  }
});
 
noble.startScanning([], true) //allows dubplicates while scanning
