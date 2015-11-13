// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {Browser} from 'clappr'
import {Events} from 'clappr'
import {Flash} from 'clappr'
import {Mediator} from 'clappr'
import {Styler} from 'clappr'
import template from 'clappr/src/base/template'

import flashHTML from 'html!../public/flash.html'
import flashStyle from '!raw!sass!../public/flash.scss'

export default class RTMP extends Flash {
    get name() { return 'rtmp' }
    get tagName() { return 'object' }
    get template() { return template(flashHTML) }
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
        this.options.rtmpConfig = this.options.rtmpConfig || {}
        this.options.rtmpConfig.swfPath = this.options.rtmpConfig.swfPath || '//cdn.jsdelivr.net/clappr.rtmp/latest/assets/RTMP.swf'
        this.options.rtmpConfig.wmode = this.options.rtmpConfig.wmode || 'transparent' // Default to transparent wmode - IE always uses gpu as per objectIE
        this.options.rtmpConfig.bufferTime = this.options.rtmpConfig.bufferTime || 0.1
        this.options.rtmpConfig.scaling = this.options.rtmpConfig.scaling || 'letterbox'
        this.options.rtmpConfig.playbackType = this.options.rtmpConfig.playbackType || this.options.src.indexOf('live') > -1
        this.options.rtmpConfig.startLevel = this.options.rtmpConfig.startLevel || 0
        this.setupPlaybackType()
    }

    getPlaybackType() {
        return this.options.rtmpConfig.playbackType
    }

    get swfPath() {
        return this.options.rtmpConfig.swfPath
    }

    get currentLevel() {
        return this.el.getCurrentLevel();
    }

    get numLevels() {
        return this.el.getNumLevels();
    }


    set currentLevel(level) {
        this.el.setLevel(level);
    }

    get autoSwitchLevels() {
        return this.el.isAutoSwitchLevels();
    }

    get levels() {
        var levels = [];

        for (var i = 0; i < this.numLevels; i++) {
            var bitrate = this.el.getBitrateForLevel(i);

            levels.push({
                bitrate: bitrate * 1000, // KBytes to Bytes
                label: bitrate
            });
        }

        return levels;
    }

    get isDynamicStream() {
        return this.el.isDynamicStream();
    }

    addListeners() {
        Mediator.on(this.uniqueId + ':progress', this.progress, this)
        Mediator.on(this.uniqueId + ':timeupdate', this.updateTime, this)
        Mediator.on(this.uniqueId + ':statechanged', this.checkState, this)
        Mediator.on(this.uniqueId + ':levelChanged', this.levelChange, this)
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

    updateTime() {
        if (this.getPlaybackType() === 'live') {
            this.trigger(Events.PLAYBACK_TIMEUPDATE, 1, 1, this.name)
        } else {
            this.trigger(Events.PLAYBACK_TIMEUPDATE, this.el.getPosition(), this.el.getDuration(), this.name)
        }
    }

    levelChange() {
        var data = {level: this.currentLevel}
        this.trigger(Events.PLAYBACK_LEVEL_SWITCH, data)
        var currentLevel = this.levels[data.level]
        if (currentLevel) {
            this.trigger(Events.PLAYBACK_BITRATE, {
                bitrate: currentLevel.bitrate,
                level: data.level
            })
        }
    }

    setupPlaybackType() {
        if (this.getPlaybackType() === 'live') {
            this.settings = {'left': ["playpause"], 'default': ['seekbar'], 'right': ['fullscreen', 'volume']}
            this.settings.seekEnabled = false
            this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
        }
    }

    render() {
        this.$el.html(this.template({ cid: this.cid, swfPath: this.swfPath, playbackId: this.uniqueId, wmode: this.options.rtmpConfig.wmode, scaling: this.options.rtmpConfig.scaling,
                                      bufferTime: this.options.rtmpConfig.bufferTime, playbackType: this.options.rtmpConfig.playbackType, startLevel: this.options.rtmpConfig.startLevel }))
        if (Browser.isIE) {
            this.$('embed').remove()
            if (Browser.isLegacyIE) {
                this.$el.attr('classid', IE_CLASSID)
            }
        } else if (Browser.isFirefox) {
            this.setupFirefox()
        }
        this.el.id = this.cid
        var style = Styler.getStyleFor(flashStyle)
        this.$el.append(style)
        return this
    }

    checkState() {
        super.checkState()

        if (this.isDynamicStream) {
            this.trigger(Events.PLAYBACK_FRAGMENT_LOADED)
        }
    }
}

RTMP.canPlay = function (source) {
    return !!((source.indexOf('rtmp://') > -1 || source.indexOf('.smil') > -1) && Browser.hasFlash)
};

RTMP.debug = s => console.log(s)
