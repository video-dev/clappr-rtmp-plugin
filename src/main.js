// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Flash = require('flash')
var JST = require('../jst')
var Mediator = require('mediator')
var Browser = require('browser')
var Styler = require('./styler')

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-flash-vod=""><param name="movie" value="<%= swfPath %>"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="gpu"> <param name="tabindex" value="1"> <param name=FlashVars value="playbackId=<%= playbackId %>" /> </object>'

class RTMP extends Flash {
  get name() { return 'rtmp' }
  get tagName() { return 'object' }
  get template() { return JST.rtmp }
  get attributes() {
    return {'data-rtmp': '', 'type': 'application/x-shockwave-flash'}
  }

  constructor(options) {
    super(options)
    this.swfPath = "assets/RTMP.swf"
  }

  bootstrap() {
    console.log("bootstrap called!")
  }

  addListeners() {
    Mediator.on(this.uniqueId + ':progress', this.progress, this)
    Mediator.on(this.uniqueId + ':timeupdate', this.updateTime, this)
    Mediator.on(this.uniqueId + ':statechanged', this.checkState, this)
    Mediator.on(this.uniqueId + ':flashready', this.bootstrap, this)
  }

  stopListening() {
    Mediator.off(this.uniqueId + ':progress')
    Mediator.off(this.uniqueId + ':timeupdate')
    Mediator.off(this.uniqueId + ':statechanged')
    Mediator.off(this.uniqueId + ':flashready')
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template({ cid: this.cid, swfPath: this.swfPath, playbackId: this.uniqueId }))
    if(Browser.isFirefox) {
      this.setupFirefox()
    } else if (Browser.isLegacyIE) {
      this.setupIE()
    }
    this.$el.append(style)
    return this
  }
}

RTMP.canPlay = function(source) {
  return !!(source.indexOf('rtmp://') > -1)
};


module.exports = window.RTMP = RTMP;
