cp *.* ~/node-ex/node-tutorial-2-restful-app
cd /home/root/node-ex/node-tutorial-2-restful-app
rm -rf /home/root/node-ex/node-tutorial-2-restful-app/data/*
mongod --dbpath /home/root/node-ex/node-tutorial-2-restful-app/data &
node bin/www &
node bluetoothscan.js
node scanner_server_demo.js &
node sonar_beep.js &
node /home/root/edi-cam/web/server/server.js &

