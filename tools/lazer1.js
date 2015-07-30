var sleep = require('sleep');
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa vimport mraa 

var DecimalValue = 0.0;  //Initialization of value converted
var ADCValue = 0.0;      //Initialization of value to be read
var x = new m.Aio(0);    //We are going to use pin A0 in the Arduino Expansion Board
var y = new m.Aio(1);    //We are going to use pin A1 as point B
var x_arrived = 0; 
var y_arrived = 0;
var x_arrive_time = Date.now();
var x_left_time = Date.now();
var y_arrive_time = Date.now();
var y_left_time = Date.now();
var displayed = 0;
while (1) {
		x.setBit(12)         //Use 12 bits of the ADC
                y.setBit(12)         //Use 12 bits of the ADC
		ADCValue = x.read()  
		DecimalValue = ADCValue/819.0 //Conversion to a Decimal Value
		if (DecimalValue > 1) {
			if (x_arrived == 0) {
				x_arrive_time = Date.now();
			}
			x_arrived = 1;
		} else if (x_arrived == 1) {
			x_left_time = Date.now(); 
			x_arrived = 0;
		}
 
                ADCValue = y.read()
                DecimalValue = ADCValue/819.0 //Conversion to a Decimal Value
                if (DecimalValue > 1) {
                        if (y_arrived == 0) {
                                y_arrive_time = Date.now();
                        }
                        y_arrived = 1;
                } else if (y_arrived == 1) {
                        y_left_time = Date.now();
                        y_arrived = 0;
                }

                if (x_arrived == 0 && y_arrived == 0) {
                        x_arrive_time = y_arrive_time = 0;
                        x_left_time = y_left_time = 0;
			sleep.usleep(10000);
			displayed = 0;
		}
                else if (x_arrived == 1 && y_arrived == 0) {
                        if (y_arrive_time != 0 && displayed == 0) {                                                                                                                                                                
                                console.log('Wrong way');
				displayed = 1;
			}
		}
		else if (x_arrived == 0 && y_arrived == 1) {
			if (x_arrive_time == 0 && displayed == 0) {
				console.log('Wrong way');
                                displayed = 1;
                        }
		}
		else {
			if (displayed == 0) {
                        	console.log('Speed');
                	        console.log(18/(y_arrive_time - x_arrive_time));
				displayed = 1;
			}
		}
          }

