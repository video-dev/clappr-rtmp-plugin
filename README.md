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

**RTMP.swf path**

Provide `swfPath: '/assets/RTMP.swf` or similar in the player config to affect where the player SWF is loaded from. Defaults to the Clappr CDN.

**Flash wmode**

 The wmode parameter of the flash player can be changed by providing a configuration option: `wmode: 'opaque'` in the player config. This does not affect IE's 'gpu' wmode default. Defaults to `transparent`.

**Video Scaling**

The video scaling mode, set by `scaling: 'MODE'` takes 4 different arguments:

 * `letterbox` (default)
* `stretch`
* `zoom`
* `none`

Currently the only way to update this on the fly is by accessing the raw player element and calling `playerScaling('MODE')` 

*For example*
 `$('[data-rtmp]')[0].playerScaling('stretch');`
