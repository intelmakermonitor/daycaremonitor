# starting mongodb and web server
rm -rf /home/root/node-ex/node-tutorial-2-restful-app/data
mkdir /home/root/node-ex/node-tutorial-2-restful-app/data
mongod --dbpath /home/root/node-ex/node-tutorial-2-restful-app/data &
node /home/root/node-ex/node-tutorial-2-restful-app/bin/www &

# start bluetooth demo 
node /home/root/daycaremonitor/tools/noble-ble/scanner_server_demo.js &
node /home/root/daycaremonitor/tools/noble-ble/bluetoothscan.js &

# start sonar and beep
node /home/root/daycaremonitor/tools/noble-ble/sonar_beep.js &

# start webcam and streaming
node /home/root/edi-cam/web/server/server.js &
~/ffmpeg-2.6.1-32bit-static/ffmpeg  -s 320x240 -f video4linux2 -i /dev/video0 -f mpeg1video -b 800k -r 30 http://192.168.123.98:8082




