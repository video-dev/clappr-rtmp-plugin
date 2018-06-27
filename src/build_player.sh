$(find $HOME/airsdk/ -name mxmlc | head -n1) -define CONFIG::LOGGING false -define CONFIG::MOCK false -define CONFIG::PLATFORM true -define CONFIG::FLASH_10_1 true -default-background-color=0x000000 -default-size=640,360 -language=as3 -output=../public/RTMP.swf -optimize=true -compress=true -use-gpu=true -target-player=30.0 -use-network=false RTMP.as -library-path+=./OSMF.swc:./SMILPlugin.swc

