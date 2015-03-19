
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

var trigPin = new m.Gpio(4); //setup digital read on pin 4
trigPin.dir(m.DIR_OUT); //set the gpio direction to output

var buzz = new m.Gpio(8); 
buzz.dir(m.DIR_OUT); //set the gpio direction to output
buzz.write(0);

//replace localhost with your server's IP;
var socket = require('socket.io-client')('http://localhost:6000/scanner');
socket.on('connect', function()
{
  console.log('connected to server');
});

//add you bt mac here
var BTDevices = ["a4d856039ebf", "ee443390fa9d", "fb738cf43b8a"];

var noble = require('noble');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});

var rssi_entry = 0;
var rssi_exit = 0;
var checkin = 0;

db.collection('userlist').insert({ "username" : "ee443390fa9d", "email" : "daycaremaker@gmail.com" }, function(err, result) {});
db.collection('userlist').insert({ "username" : "a4d856039ebf", "email" : "girl@testdomain.com" }, function(err, result) {});
db.collection('userlist').insert({ "username" : "fb738cf43b8a", "email" : "teacher@testdomain.com" }, function(err, result) {});

noble.on('discover', function(peripheral)
{
//    db.collection('userlist').insert({ "username" : peripheral.uuid, "email" : "testuser1@testdomain.com" },
    if ((peripheral.rssi <= -70) && (rssi_entry == 0)) {
      console.log('noise' + peripheral.rssi);
      return;
    }
    else if ((peripheral.rssi > -70) && (rssi_entry == 0)) {
      db.collection('userlist').findAndModify(
        {username:peripheral.uuid}, 
        [['username', 1]],
        {$set:{gender:'arrived'}}, 
        {new:true}, 
        function(err, result) {
          if (err) {
            console.log('err ' + err);
          } else {
            console.log('entering entry door');

            // un-registered bt device 
            if (result == null)
               return;

            console.log(result);
            rssi_entry = 1;
            rssi_exit = 0;
            if (checkin == 0)
              checkin = 1;
            else
              checkin = 0;
            socket.emit('uuid', result.email);
            socket.emit('rssi', checkin);
            buzz.write(1);
            sleep.usleep(1000);
            buzz.write(0);
            console.log('checkin status=', + checkin);
            console.log('email=', + result.email);
          }
        }
      );
    }
    else if ((rssi_entry == 1) && (peripheral.rssi <= -85)) {
      console.log('leaving entry door' + peripheral.rssi);
      rssi_exit = 1;
      rssi_entry = 0;
    }
    else if ((rssi_entry == 1) && (peripheral.rssi > -85))
      console.log('staying door' + peripheral.rssi);
    else
      console.log('should not be here ' + rssi_entry + rssi_exit);
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

  console.log('distance ', + distance, 'rssi_entry ', + rssi_entry);

  // Todo tune the sonar sensor 
  if ((distance < 20) || (rssi_entry == 1)) {
    noble.startScanning([], false); //do not allow dubplicates while scanning
  }
  else if (rssi_exit == 1) {
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
  //console.log('distance ' + count + ' inches');
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
