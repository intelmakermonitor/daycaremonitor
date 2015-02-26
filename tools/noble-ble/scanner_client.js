function calculateDistance(rssi) {
  var txPower = -59 //hard coded power value. Usually ranges between -59 to -65
  
  if (rssi == 0) {
    return -1.0; 
  }
 
  var ratio = rssi*1.0/txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio,10);
  }
  else {
    var distance =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;    
    return distance;
  }
}

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
      console.log('distance is: ', calculateDistance(peripheral.rssi));
    }
  }
});
 
noble.startScanning([], true) //allows dubplicates while scanning
