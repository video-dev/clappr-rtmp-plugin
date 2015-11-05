clappr-rtmp-plugin
==================

RTMP support for [Clappr player](http://github.com/globocom/clappr). Supports both RTMP direct and SMIL (dynamic streaming).

## How to use

Import rtmp.min.js

```javascript
<script type="text/javascript" src="http://cdn.jsdelivr.net/clappr.rtmp/latest/rtmp.min.js">
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
        startLevel: 0
    },
});
```

## Configuration

The plugin accepts several **optional** configuration options, such as:

  - `swfPath` (default **//cdn.jsdelivr.net/clappr.rtmp/latest/assets/RTMP.swf**) - Path to the SWF responsible for the playback.
  - `scaling` (default **letterbox**) - Path to the SWF responsible for the playback.
  - `playbackType` (default **live** if the source contains live on its URL, **vod** otherwise).
  - `bufferTime` (default **0.1**) - How long to buffer before start playing the media.
  - `startLevel` (default **0**) - Initial quality level index.

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
