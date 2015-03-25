var status = process.argv.slice(2);

console.log(status);

var email   = require("/home/root/emailjs/email");
var server  = email.server.connect({
   user:    "daycaremaker",
   password:"Intel123",
   host:    "smtp.gmail.com",
   ssl:     true
});

// send the message and get a callback with an error or details of the message that was sent
var message = {
   text:    status[0],
   from:    "<daycaremaker@gmail.com>",
   to:      "<daycaremaker@gmail.com>",
   subject: status[1]
}

server.send(message, function(err, message) {console.log(err||message); });
 

