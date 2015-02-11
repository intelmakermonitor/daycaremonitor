
    ______ ______                                  __            _  __     __
   / ____// ____/____ ___   ____   ___   ____ _   / /_   __  __ (_)/ /____/ /
  / /_   / /_   / __ `__ \ / __ \ / _ \ / __ `/  / __ \ / / / // // // __  / 
 / __/  / __/  / / / / / // /_/ //  __// /_/ /  / /_/ // /_/ // // // /_/ /  
/_/    /_/    /_/ /_/ /_// .___/ \___/ \__, /  /_.___/ \__,_//_//_/ \__,_/   
                        /_/           /____/                                 


                build: ffmpeg-git-20150204-32bit-static.tar.xz
              version: N-42968-g77f326d
 
                  gcc: 4.9.2
                 yasm: 1.2.0

               libass: 0.12.1
               libvpx: 1.3.0-5425-g3a5d406
              libx264: 0.144.48 40bb568
              libx265: 1.4+487-f189b9328d93
              libxvid: 1.3.3-1
              libwebp: 0.4.2
            libgnutls: 3.2.21
            libtheora: 1.1.1
           libvidstab: 1.0
          libfreetype: 2.5.2-2
          libopenjpeg: 1.5.2 

              libopus: 1.1-2
             libspeex: 1.2
            libvorbis: 1.3.4-2
           libmp3lame: 3.99.5
         libvo-aacenc: 0.1.3-1
       libvo-amrwbenc: 0.1.3-1
    libopencore-amrnb: 0.1.3-2.1
    libopencore-amrwb: 0.1.3-2.1

      For HEVC/H.265 encoding:  ffmpeg -h encoder=libx265
                                http://x265.readthedocs.org/en/default/cli.html#standalone-executable-options

      For AVC/H.264 encoding:   ffmpeg -h encoder=libx264
                                http://mewiki.project357.com/wiki/X264_Settings

                 FFmpeg Wiki:   https://trac.ffmpeg.org/wiki


      Notes: ffmpeg-10bit is built with 10-bit AVC/H.264 encoding support.

             A limitation of statically linking glibc is the loss of DNS resolution. Installing
             nscd through your package manager will fix this or you can use
             "ffmpeg -i http://<ip address here>/" instead of "ffmpeg -i http://example.com/"


      If you appreciate this up-to-date build of FFmpeg and my time that goes into to maintaining it,
      please consider making a donation. Thank you. 
      
      Paypal tinyurl: http://goo.gl/1Ol8N

      email: john.vansickle@gmail.com
      irc: relaxed @ irc://irc.freenode.net #ffmpeg
      url: http://johnvansickle.com/ffmpeg/
