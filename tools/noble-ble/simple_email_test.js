var exec = require('exec-sync');

var name = 'April_blabla';
var status ='Arrived';
var phone = '15122946365';

var child = exec(['node email_demo.js '  +name +' ' +status +' ' +phone]);

