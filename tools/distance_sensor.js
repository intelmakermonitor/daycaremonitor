var sleep = require('sleep');
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var detect_timeout;
var pulsewidth_timeout;
var count = 0;
var detected = 0;
var wait = 0;

var echoPin = new m.Gpio(6); //setup digital read on pin 6
echoPin.dir(m.DIR_IN); //set the gpio direction to input

var trigPin = new m.Gpio(7); //setup digital read on pin 7
trigPin.dir(m.DIR_OUT); //set the gpio direction to output

//replace localhost with your server's IP;
var socket = require('socket.io-client')('http://localhost:3000/scanner');
socket.on('connect', function()
{
  console.log('connected to server');
});

//add you bt mac here
var BTDevices = ["a4d856039ebf", "ee443390fa9d", "fb738cf43b8a"];

var noble = require('noble');

noble.on('discover', function(peripheral)
{
  for (var i = 0; i < BTDevices.length; i++) {
    if(peripheral.uuid == BTDevices[i]){
      console.log('deviceData', {mac: peripheral.uuid, rssi:peripheral.rssi});
      socket.emit('uuid', peripheral.uuid);
      socket.emit('rssi', peripheral.rssi);
      //console.log('bt distance ' + bt_distance(peripheral.rssi));
    }
  }
});

//Math = require('mathjs');

trigger_fire();

function trigger_fire() 
{
  // send 10ms pulse trigger
  count = 0; 
  detected = 0;
  var distance = 0;

  //console.log('trigger_fire ' + wait);

  trigPin.write(0); //set the digital pin to low
  sleep.usleep(2000);
  trigPin.write(1); //set the digital pin to high (1)
  sleep.usleep(10000);
  trigPin.write(0); //set the digital pin to low
 
  detect_high();
  distance = pulsewidth_high();

  // Todo tune the sonar sensor 
  if (distance < 20) {
    noble.startScanning([], false); //do not allow dubplicates while scanning
  }
  else {
    noble.stopScanning();
  }

  setTimeout(trigger_fire, 1000);
}

function detect_high() //
{
  var echo = 0;
  var wait = 0;

  while (detected == 0) {
     echo = echoPin.read(); //read the digital value of the pin
     if (echo > 0 ) {
         detected = 1;
     }
     else {
	    wait++;
        sleep.usleep(100);
     }
  }
  return wait;
}

function pulsewidth_high() //
{
  count = 0;
  while (echoPin.read() == 1) {
     count++;
     sleep.usleep(100);
  }
  console.log('distance ' + count + ' inches');
  return count;
}

//function bt_distance(rssi) {
//  
//  var txPower = -59; // max rssi
// 
//  if (rssi == 0) {
//    return -1.0; 
//  }
//
//  var ratio = rssi*1.0/txPower;
//  if (ratio < 1.0) {
//    return Math.pow(ratio,10);
//  }
//  else {
//    return (0.89976)*Math.pow(ratio,7.7095) + 0.111;    
//  }
//} 
