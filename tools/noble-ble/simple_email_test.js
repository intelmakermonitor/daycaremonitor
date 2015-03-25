var exec = require('exec-sync');

var name = 'Caden';
var status ='Arrived';

var child = exec(['node email_demo.js '  +name +' ' +status]);


