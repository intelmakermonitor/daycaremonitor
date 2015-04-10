#!/bin/sh

/media/sdcard/ffmpeg/ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 -f mpeg1video \
-b 800k -r 30 http://192.168.15.79:8082

