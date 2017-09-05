clappr-rtmp-plugin
==================

RTMP support for [Clappr player](http://github.com/globocom/clappr). Supports both RTMP direct and SMIL (dynamic streaming).

## How to use

Import rtmp.min.js

```javascript
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/video-dev/clappr-rtmp-plugin@latest/dist/rtmp.min.js">
</script>
```
and create Clappr Player adding the external plugin:

```javascript
var player = new Clappr.Player({
    source: "rtmp://source_here",
    parentId: "#player-wrapper",
    plugins: {'playback': [RTMP]},
    rtmpConfig: {
        swfPath: 'dist/assets/RTMP.swf',
        scaling:'stretch',
        playbackType: 'live',
        bufferTime: 1,
        startLevel: 0,
        switchRules: {
            "SufficientBandwidthRule": {
                "bandwidthSafetyMultiple": 1.15,
                "minDroppedFps": 2
            },
            "InsufficientBufferRule": {
                "minBufferLength": 2
            },
            "DroppedFramesRule": {
                "downSwitchByOne": 10,
                "downSwitchByTwo": 20,
                "downSwitchToZero": 24
            },
            "InsufficientBandwidthRule": {
                "bitrateMultiplier": 1.15
            }
        }
    },
});
```

## Configuration

The plugin accepts several **optional** configuration options, such as:

  - `swfPath` (default **//cdn.jsdelivr.net/clappr.rtmp/latest/assets/RTMP.swf**) - Path to the SWF responsible for the playback.
  - `scaling` (default **letterbox**) - Scaling behavior.
  - `playbackType` (default **live** if the source contains live on its URL, **vod** otherwise).
  - `bufferTime` (default **0.1**) - How long to buffer before start playing the media.
  - `startLevel` (default **-1**) - Initial quality level index.
  - `autoSwitch` (default **false**) - Whether video should autoSwitch quality
  - `useAppInstance` (default **false**) - Set it to `true` if your source url contains the app instance (not required if the app instance is `_definst_`).
  - `proxyType` (default **none**) - Determines which fallback methods are tried if an initial connection attempt to Flash Media Server fails.
  - `switchRules` (default **system defined**) - Rules defined to autoSwitch video quality based in some conditions.

## Building

#### Requirements

1. [AirSDK](http://www.adobe.com/devnet/air/air-sdk-download.html)
2. [Webpack](https://www.npmjs.com/package/webpack)

#### Compile SWF

```sh
cd src
sh build_player.sh
```

#### Download JS dependencies

```sh
npm install
```

#### Build the final dist

```sh
webpack
```
