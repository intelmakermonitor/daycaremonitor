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

db.collection('userlist').insert({ "childid" : "ee443390fa9d", "childname" : "LightBlue", "parentphone" : "15122946365", "email" : "daycaremaker@gmail.com", "age" : "5", "parentname" : 
"Light Blue Dad", "gender" : "male", "status" : "off site"}, function(err, result) {});
db.collection('userlist').insert({ "childid" : "fb738cf43b8a", "childname" : "DeepBlue", "parentphone" : "15122946365", "email" : "daycaremaker@gmail.com", "age" : "6", "parentname" :    
"Deep Blue Dad", "gender" : "male", "status" : "off site"}, function(err, result) {});
db.collection('userlist').insert({ "childid" : "db4d38b6ffb1", "childname" : "LightGreen", "parentphone" : "15122946365", "email" : "daycaremaker@gmail.com", "age" : "4", "parentname" :    
"Light Green Mom", "gender" : "female", "status" : "off site"}, function(err, result) {});

noble.on('discover', function(peripheral)
{
    if (peripheral.advertisement.localName != 'estimote') {
//      console.log('discard un-wanted device with local name: ' + peripheral.advertisement.localName);
      return;
    }

//    console.log('advertising the following service uuid\'s: ' + peripheral.uuid);

//    peripheral.connect(function(error) {
//      console.log('connected to peripheral: ' + peripheral.uuid);
//      peripheral.discoverServices(BTDevices, function(error, services) {
//        for (var i in services) {
//          var deviceInformationService = services[i];
//        }
//      }
//    }

    if (peripheral.rssi <= -85) {
//    console.log('noise' + peripheral.rssi);
      return;
    }
    else {
      temp_uuid = peripheral.uuid;
      db.collection('userlist').findAndModify(
        {childid:peripheral.uuid}, 
        [['childid', 1]],
        {$set:{status:'arrived'}}, 
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

            socket.emit('uuid', result.childname);
            socket.emit('phone_no', result.parentphone);
            socket.emit('rssi', peripheral.rssi);

//            console.log(result); 

          }
        }
      );
    }
});

noble.startScanning([], true);

