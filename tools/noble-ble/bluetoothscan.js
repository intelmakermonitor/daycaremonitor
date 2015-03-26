//replace localhost with your server's IP;
var socket = require('socket.io-client')('http://localhost:6000/scanner');
socket.on('connect', function()
{
  console.log('connected to server');
});

//add you bt mac here
var BTDevices = ['ee443390fa9d', 'fb738cf43b8a', 'db4d38b6ffb1'];

var noble = require('noble');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});

var rssi_entry = 0;
var rssi_exit = 0;
var checkin = 0;    
var temp_uuid;

db.collection('userlist').insert({ "username" : "ee443390fa9d", "email" : "LightBlue", "location" : "15122946365" }, function(err, result) {});
db.collection('userlist').insert({ "username" : "fb738cf43b8a", "email" : "DeepBlue", "location" : "15122946365" }, function(err, result) {});
db.collection('userlist').insert({ "username" : "db4d38b6ffb1", "email" : "LightGreen", "location" : "15122946365" }, function(err, result) {});

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

    if (peripheral.rssi <= -85) {
      console.log('noise' + peripheral.rssi);
      return;
    }
    else {
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

            socket.emit('uuid', result.email);
            socket.emit('phone_no', result.location);
            socket.emit('rssi', peripheral.rssi);

//            console.log(result); 

          }
        }
      );
    }
});

noble.startScanning([], true);

