clappr-rtmp-plugin
==================

RTMP support for [Clappr player](http://github.com/globocom/clappr)

## How to use

Import rtmp.min.js

```javascript
<script type="text/javascript" src="http://cdn.jsdelivr.net/clappr.rtmp/0.0.6/rtmp.min.js">
</script>
```
and create Clappr Player adding the external plugin:

```javascript
var player = new Clappr.Player({
      source: "rtmp://source_here", 
      parentId: "#player-wrapper", 
      plugins: {'playback': [RTMP]}
    );
```

Streams that has `live` on their URL will be handled as live streams. If not so, the plugin will play the source as VoD.

## Additional configuration options
**Flash wmode**

 The wmode parameter of the flash player can be changed by providing a configuration option: `wmode: 'opaque'` in the player config. This does not affect IE's 'gpu' wmode default. Defaults to `transparent`.