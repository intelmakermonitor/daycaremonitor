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

var trigPin = new m.Gpio(7); //setup digital read on pin 7
trigPin.dir(m.DIR_OUT); //set the gpio direction to output

trigger_fire();


function trigger_fire() 
{
  // send 10ms pulse trigger
  count = 0; 
  detected = 0;

  //console.log('trigger_fire ' + wait);

  trigPin.write(0); //set the digital pin to low
  sleep.usleep(2000);
  trigPin.write(1); //set the digital pin to high (1)
  sleep.usleep(10000);
  trigPin.write(0); //set the digital pin to low
 
  detect_high();
  pulsewidth_high();

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
  console.log('distance ' + count + ' inches');
}

