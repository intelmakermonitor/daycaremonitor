var sleep = require('sleep');
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa vimport mraa 

var DecimalValue = 0.0;  //Initialization of value converted
var ADCValue = 0.0;      //Initialization of value to be read
var x = new m.Aio(0);    //We are going to use pin A0 in the Arduino Expansion Board
var arrived = 0;
var arrive_time = Date.now();
var left_time = Date.now();

while (1) {
		x.setBit(12)         //Use 12 bits of the ADC
		ADCValue = x.read()  
		DecimalValue = ADCValue/819.0 //Conversion to a Decimal Value
		if (DecimalValue > 1) {
			if (arrived == 0) {
				arrive_time = Date.now();
				//console.log('car arrived');
				}
			arrived = 1;
		} else if (arrived == 1) {
			left_time = Date.now() - arrive_time; 
			console.log('Speed');
			console.log(7500/left_time);
			arrived = 0;
		}

		sleep.usleep(10000);
          }

