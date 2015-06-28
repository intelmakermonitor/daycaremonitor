cp *.js ~/node-ex/node-tutorial-2-restful-app
cd /home/root/node-ex/node-tutorial-2-restful-app
rm -rf /home/root/node-ex/node-tutorial-2-restful-app/data/
mkdir -p /home/root/node-ex/node-tutorial-2-restful-app/data
mongod --dbpath /home/root/node-ex/node-tutorial-2-restful-app/data &
node bin/www &
node bluetoothscan.js &
node scanner_server_demo.js &
node /home/root/edi-cam/web/server/server.js &

