var sleep = require('sleep');
var child = require('child_process').exec('rm /media/sdcard/test.jpeg')
child.stdout.pipe(process.stdout)
child.on('exit', function() {
//  process.exit()
})

var child1 = require('child_process').exec('/media/sdcard/ffmpeg/ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 -vframes 1 /media/sdcard/test.jpeg')
child1.stdout.pipe(process.stdout)
child1.on('exit', function() {
//  process.exit()
})

var email   = require("/home/root/emailjs/email");
var server  = email.server.connect({
   user:    "daycaremaker",
   password:"Intel123",
   host:    "smtp.gmail.com",
   ssl:     true
});

// send the message and get a callback with an error or details of the message that was sent
var message = {
   text:    "Your child has checked in",
   from:    "<daycaremaker@gmail.com>",
   to:      "<daycaremaker@gmail.com>",
   subject: "Your child has checked in",
   attachment:
   [
      {data:"<html> Your child has checked in! </html>", alternative:true},
      {path:"/media/sdcard/test.jpeg", type:"application/jpeg", name:"test.jpeg"}
   ]
}

sleep.usleep(5000000);
server.send(message, function(err, message) {console.log(err||message); });
 
//server.send(message, function(err, message) {console.log(err); });

