//replace localhost with your server's IP;
var socket = require('socket.io-client')('http://localhost:6000/scanner');
socket.on('connect', function()
{
  console.log('connected to server');
});

//add you bt mac here
var BTDevices = ['<CHILD 1 BLE ID>', '<CHILD 2 BLE ID>'];

var noble = require('noble');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});

var rssi_entry = 0;
var rssi_exit = 0;
var checkin = 0;    
var temp_uuid;

db.collection('userlist').insert({ "childid" : "<CHILD 1 BLE ID>", "childname" : "<CHILD 1 NAME>", "parentphone" : "0123456789", "email" : "<CHILD 1 PARENT EMAIL>", "age" : "<CHILD 1 AGE>", "parentname" : 
"CHILD 1 PARENT NAME", "gender" : "<CHILD 1 GENDER>", "status" : "off site"}, function(err, result) {});

db.collection('userlist').insert({ "childid" : "<CHILD 2 BLE ID>", "childname" : "<CHILD 2 NAME>", "parentphone" : "0123456789", "email" : "<CHILD 2 PARENT EMAIL>", "age" : "<CHILD 2 AGE>", "parentname" : 
"CHILD 2 PARENT NAME", "gender" : "<CHILD 2 GENDER>", "status" : "off site"}, function(err, result) {});

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