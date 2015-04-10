cd /home/root/node-tutorial-2-restful-app
rfkill unblock bluetooth
rm -rf /home/root/node-tutorial-2-restful-app/data/*
mongod --dbpath /home/root/node-tutorial-2-restful-app/data &
node bin/www &
node bluetoothscan.js &
cd /media/sdcard/daycaremonitor/tools/noble-ble/
node scanner_server_demo.js &
node sonar_beep.js &
node /home/root/edi-cam/web/server/server.js &

