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
  pre_distance = cur_distance;
  cur_distance = distance;

  console.log('distance ', + distance);

  // Todo tune the sonar sensor 
  if ((pre_distance != cur_distance) && (cur_distance < 40)) {
    buzz.write(1);
    sleep.usleep(100000);
    buzz.write(0);
  }

  setTimeout(trigger_fire, 500);
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

