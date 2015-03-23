
var sleep = require('sleep');
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var detect_timeout;
var pulsewidth_timeout;
var count = 0;
var detected = 0;
var wait = 0;

var pre_distance = 0;
var cur_distance = 0;

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
var BTDevices = ['ee443390fa9d', 'fb738cf43b8a'];

var noble = require('noble');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});

var rssi_entry = 0;
var rssi_exit = 0;
var checkin = 0;    
var temp_uuid = '';


db.collection('userlist').insert({ "username" : "ee443390fa9d", "email" : "daycaremaker@gmail.com" }, function(err, result) {});
db.collection('userlist').insert({ "username" : "fb738cf43b8a", "email" : "teacher@testdomain.com" }, function(err, result) {});

noble.on('discover', function(peripheral)
{
    if (peripheral.advertisement.localName != 'estimote') {
      console.log('discard un-wanted device with local name: ' + peripheral.advertisement.localName);
      return;
    }

    console.log('advertising the following service uuid\'s: ' + peripheral.uuid);

//    peripheral.connect(function(error) {
//      console.log('connected to peripheral: ' + peripheral.uuid);
//      peripheral.discoverServices(BTDevices, function(error, services) {
//        for (var i in services) {
//          var deviceInformationService = services[i];
//        }
//      }
//    }

    if ((peripheral.rssi <= -75) && (rssi_entry == 0)) {
      console.log('noise' + peripheral.rssi);
      return;
    }
    else if ((peripheral.rssi > -75) && (rssi_entry == 0)) {
      temp_uuid = peripheral.uuid;
      db.collection('userlist').findAndModify(
        {username:peripheral.uuid}, 
        [['username', 1]],
        {$set:{gender:'arrived'}}, 
        {new:true}, 
        function(err, result) {
          if (err) {
            console.log('err ' + err);
          } else {
            // un-registered bt device 
            if (result == null){
               console.log('uuid not registered in db');
               return;
            }
            if (pre_distance != cur_distance) {
               console.log('moving target exit ', + cur_distance, + pre_distance);
               return;
            }

            console.log('entering entry door');
            rssi_entry = 1;
            rssi_exit = 0;
            if (checkin == 0)
              checkin = temp_uuid;
            else
              checkin = 0;
 
            socket.emit('uuid', result.email);
            socket.emit('rssi', checkin);

            console.log('check-in uuid ', + checkin);
            //console.log('sending email ', + result.email);
            console.log(result); 

            // beep
            buzz.write(1);
            sleep.usleep(1000);
            buzz.write(0);
          }
        }
      );
    }
    else if ((rssi_entry == 1) && (peripheral.rssi <= -85)) {
      if (peripheral.uuid == checkin) {
        console.log('leaving entry door' + peripheral.rssi);
        rssi_exit = 1;
        rssi_entry = 0;
        buzz.write(1);
        sleep.usleep(1000);
        buzz.write(0);
      }
      else {
        // another device show up, ignore now
      }
    }
    else if ((rssi_entry == 1) && (peripheral.rssi > -85))
      console.log('staying door' + peripheral.rssi);
    else
      console.log('should not be here ' + rssi_entry, + rssi_exit, + peripheral.uuid, + peripheral.rssi);
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
  if (distance < 40) {
    noble.startScanning([], true); //do not allow dubplicates while scanning
    pre_distance = cur_distance;
    cur_distance = distance;
  }
  // assume pass the gate
  else if (rssi_entry == 1) {
    rssi_exit = 1;
    rssi_entry = 0; 
    noble.stopScanning();
    console.log('sonar lost target, assume leaving');

    buzz.write(1);
    sleep.usleep(1000);
    buzz.write(0);
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
