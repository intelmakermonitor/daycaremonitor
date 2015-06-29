var status = process.argv.slice(2);
 
console.log(status);
 
var email   = require("/usr/lib/node_modules/emailjs/email");
var server  = email.server.connect({
   user:    "<YOUR DAYCARE'S EMAIL USER NAME>",
   password:"<YOUR DAYCARE'S EMAIL PASSWORD",
   host:    "<YOUR DAYCARE'S EMAIL HOST>",
   ssl:     true
});
 
// send the message and get a callback with an error or details of the message that was sent
var message = {
   text:    status[0],
   from:    "<YOUR DAYCARE'S FULL EMAIL ADDRESS>",
   to:      "<YOUR DAYCARE CHILD'S PARENT FULL EMAIL ADDRESS>",
   subject: status[1]
}
 
server.send(message, function(err, message) {console.log(err||message); });