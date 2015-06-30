//replace localhost with your server's IP;
var socket = require('socket.io-client')('http://localhost:6000/scanner');
socket.on('connect', function()
{
  console.log('connected to server');
});

//add you bt mac here
var BTDevices = ['ee443390fa9d'];

var noble = require('noble');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});

var rssi_entry = 0;
var rssi_exit = 0;
var checkin = 0;    
var temp_uuid;

db.collection('userlist').insert({ "childid" : "ee443390fa9d", "childname" : "danny", "parentphone" : "0123456789", "email" : "daycaremaker@gmail.com", "age" : "5", "parentname" : 
"danny's mom", "gender" : "male", "status" : "off site"}, function(err, result) {});


noble.on('discover', function(peripheral)
{
    if (peripheral.advertisement.localName != 'estimote') {
      return;
    }

    if (peripheral.rssi <= -85) {
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
          }
        }
      );
    }
});

noble.startScanning([], true);