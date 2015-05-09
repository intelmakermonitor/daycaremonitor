#!/bin/sh

/home/root/daycaremonitor/tools/ffmpeg-git-20150204-32bit-static/ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 -f mpeg1video \
-b 800k -r 30 http://192.168.123.111:8082

