var twilio = require('twilio');
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
 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('AC88e614bc5610eb7906a13f6d7d370275', '628835a8f02a9be5a516cee023f7d508');
 
// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
client.sms.messages.create({
    to:status[2],
    from:'+15125807255',
    body:status[0] + ' ' + status[1]
}, function(error, message) {
    // The HTTP request to Twilio will run asynchronously. This callback
    // function will be called when a response is received from Twilio
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request. In this case, it is the
        // information about the text messsage you just sent:
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
 
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('Oops! There was an error.');
    }
});

