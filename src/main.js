// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Flash = require('flash')
var JST = require('../jst')
var Browser = require('browser')
var Events = require('events')

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-flash-vod=""><param name="movie" value="<%= swfPath %>"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="gpu"> <param name="tabindex" value="1"> <param name=FlashVars value="playbackId=<%= playbackId %>" /> </object>'

class RTMP extends Flash {
  get name() { return 'rtmp' }
  get tagName() { return 'object' }
  get template() { return JST.rtmp }
  get attributes() {
    return {
      'data-rtmp': '',
      'type': 'application/x-shockwave-flash',
      'width': '100%',
      'height': '100%'
    }
  }

  constructor(options) {
    super(options)
    this.options = options
    this.swfPath = "assets/RTMP.swf"
    this.setupPlaybackType()
  }

  bootstrap() {
    this.isReady = true
    this.trigger(Events.PLAYBACK_READY, this.name)
  }

  getPlaybackType() {
    return this.playbackType
  }

  setupPlaybackType() {
    if (this.options.src.indexOf('live') > -1) {
      this.playbackType = 'live'
      this.settings = {'left': ["playstop"], 'default': ['seekbar'], 'right': ['fullscreen', 'volume']}
      this.settings.seekEnabled = false
      this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
    } else {
      this.playbackType = 'vod'
    }
  }

 render() {
    this.$el.html(this.template({ cid: this.cid, swfPath: this.swfPath, playbackId: this.uniqueId }))
    if(Browser.isFirefox) {
      this.setupFirefox()
    } else if (Browser.isLegacyIE) {
      this.setupIE()
    }
    return this
  }
}

RTMP.canPlay = function(source) {
  return !!(source.indexOf('rtmp://') > -1)
};


module.exports = window.RTMP = RTMP;
