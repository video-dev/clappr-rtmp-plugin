clappr-rtmp-plugin
==================

RTMP support for Clappr player

## How to use

Import rtmp.min.js

```javascript
<script type="text/javascript" src="http://cdn.jsdelivr.net/clappr.rtmp/0.0.2/rtmp.min.js">
</script>
```
and create Clappr Player adding the external plugin:

```javascript
var player = new Clappr.Player({
    source: "rtmp://source_here", 
    parentId: "#player-wrapper", 
    plugins: {'playback': [RTMP]});
```

