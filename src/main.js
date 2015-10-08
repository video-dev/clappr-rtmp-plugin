// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {Browser} from 'clappr'
import {Events} from 'clappr'
import {Flash} from 'clappr'
import {Mediator} from 'clappr'

export default class RTMP extends Flash {
  get name() { return 'rtmp' }
  get tagName() { return 'object' }
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
    this.setupPlaybackType()
  }

  get swfPath(){
    return "http://cdn.jsdelivr.net/clappr.rtmp/latest/assets/RTMP.swf"
  }
  addListeners() {
    Mediator.on(this.uniqueId + ':progress', this.progress, this)
    Mediator.on(this.uniqueId + ':timeupdate', this.updateTime, this)
    Mediator.on(this.uniqueId + ':statechanged', this.checkState, this)
    Mediator.on(this.uniqueId + ':flashready', this.bootstrap, this)
  }

  stopListening() {
    super.stopListening()
    Mediator.off(this.uniqueId + ':progress')
    Mediator.off(this.uniqueId + ':timeupdate')
    Mediator.off(this.uniqueId + ':statechanged')
    Mediator.off(this.uniqueId + ':flashready')
  }

  bootstrap() {
    this.el.width = '100%'
    this.el.height = '100%'
    this.isReady = true
    this.trigger(Events.PLAYBACK_READY, this.name)
    this.options.autoPlay && this.play()
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
}

RTMP.canPlay = function(source) {
  return !!(source.indexOf('rtmp://') > -1 && Browser.hasFlash)
};