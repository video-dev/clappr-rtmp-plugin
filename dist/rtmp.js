(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Clappr"));
	else if(typeof define === 'function' && define.amd)
		define(["Clappr"], factory);
	else if(typeof exports === 'object')
		exports["RTMP"] = factory(require("Clappr"));
	else
		root["RTMP"] = factory(root["Clappr"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports['default'] = __webpack_require__(1);module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2014 Globo.com Player authors. All rights reserved.
	// Use of this source code is governed by a BSD-style
	// license that can be found in the LICENSE file.
	'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if('value' in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();var _get=function get(_x,_x2,_x3){var _again=true;_function: while(_again) {var object=_x,property=_x2,receiver=_x3;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}}else if('value' in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _clappr=__webpack_require__(2);var _publicFlashHtml=__webpack_require__(3);var _publicFlashHtml2=_interopRequireDefault(_publicFlashHtml);var _rawSassPublicFlashScss=__webpack_require__(4);var _rawSassPublicFlashScss2=_interopRequireDefault(_rawSassPublicFlashScss);var RTMP=(function(_Flash){_inherits(RTMP,_Flash);_createClass(RTMP,[{key:'name',get:function get(){return 'rtmp';}},{key:'tagName',get:function get(){return 'object';}},{key:'template',get:function get(){return (0,_clappr.template)(_publicFlashHtml2['default']);}},{key:'attributes',get:function get(){return {'data-rtmp':'','type':'application/x-shockwave-flash','width':'100%','height':'100%'};}}]);function RTMP(options){_classCallCheck(this,RTMP);_get(Object.getPrototypeOf(RTMP.prototype),'constructor',this).call(this,options);this.options.rtmpConfig = this.options.rtmpConfig || {};this.options.rtmpConfig.swfPath = this.options.rtmpConfig.swfPath || '//cdn.jsdelivr.net/clappr.rtmp/latest/assets/RTMP.swf';this.options.rtmpConfig.wmode = this.options.rtmpConfig.wmode || 'transparent'; // Default to transparent wmode - IE always uses gpu as per objectIE
	this.options.rtmpConfig.bufferTime = this.options.rtmpConfig.bufferTime === undefined?0.1:this.options.rtmpConfig.bufferTime;this.options.rtmpConfig.scaling = this.options.rtmpConfig.scaling || 'letterbox';this.options.rtmpConfig.playbackType = this.options.rtmpConfig.playbackType || this.options.src.indexOf('live') > -1;this.options.rtmpConfig.useAppInstance = this.options.rtmpConfig.useAppInstance === undefined?false:this.options.rtmpConfig.useAppInstance;this.options.rtmpConfig.proxyType = this.options.rtmpConfig.proxyType || 'none';this.options.rtmpConfig.startLevel = this.options.rtmpConfig.startLevel === undefined?-1:this.options.rtmpConfig.startLevel;this.options.rtmpConfig.autoSwitch = this.options.rtmpConfig.autoSwitch === undefined?false:this.options.rtmpConfig.autoSwitch;this.options.rtmpConfig.switchRules = this.options.rtmpConfig.switchRules;this.addListeners();this._setupPlaybackType();}_createClass(RTMP,[{key:'getPlaybackType',value:function getPlaybackType(){return this._playbackType;}},{key:'addListeners',value:function addListeners(){_clappr.Mediator.on(this.uniqueId + ':progress',this._progress,this);_clappr.Mediator.on(this.uniqueId + ':timeupdate',this._updateTime,this);_clappr.Mediator.on(this.uniqueId + ':statechanged',this._checkState,this);_clappr.Mediator.on(this.uniqueId + ':playbackready',this._playbackReady,this);_clappr.Mediator.on(this.uniqueId + ':onloaded',this._reporLevels,this);_clappr.Mediator.on(this.uniqueId + ':levelChanging',this._levelChanging,this);_clappr.Mediator.on(this.uniqueId + ':levelChanged',this._levelChange,this);_clappr.Mediator.on(this.uniqueId + ':flashready',this._bootstrap,this);}},{key:'stopListening',value:function stopListening(){_get(Object.getPrototypeOf(RTMP.prototype),'stopListening',this).call(this);_clappr.Mediator.off(this.uniqueId + ':progress');_clappr.Mediator.off(this.uniqueId + ':timeupdate');_clappr.Mediator.off(this.uniqueId + ':statechanged');_clappr.Mediator.off(this.uniqueId + ':flashready');}},{key:'_bootstrap',value:function _bootstrap(){this.el.width = '100%';this.el.height = '100%';this.options.autoPlay && this.play();this._setupSettings();}},{key:'_updateTime',value:function _updateTime(){if(this.getPlaybackType() === 'live'){this.trigger(_clappr.Events.PLAYBACK_TIMEUPDATE,{current:1,total:1},this.name);}else {this.trigger(_clappr.Events.PLAYBACK_TIMEUPDATE,{current:this.el.getPosition(),total:this.el.getDuration()},this.name);}}},{key:'_levelChanging',value:function _levelChanging(){this.trigger(_clappr.Events.PLAYBACK_LEVEL_SWITCH_START);}},{key:'_levelChange',value:function _levelChange(){this.trigger(_clappr.Events.PLAYBACK_LEVEL_SWITCH_END);this.trigger(_clappr.Events.PLAYBACK_BITRATE,{level:this.currentLevel});}},{key:'findLevelBy',value:function findLevelBy(id){var foundLevel;this.levels.forEach(function(level){if(level.id === id){foundLevel = level;}});return foundLevel;}},{key:'_setupPlaybackType',value:function _setupPlaybackType(){this._playbackType = this.options.rtmpConfig.playbackType;}},{key:'_setupSettings',value:function _setupSettings(){if(this.getPlaybackType() === 'live'){this.settings.left = ["playpause"];this.settings.right = ["fullscreen","volume"];this.settings.seekEnabled = false;}else {this.settings.left = ["playpause","position","duration"];this.settings.right = ["fullscreen","volume"];}this.trigger(_clappr.Events.PLAYBACK_SETTINGSUPDATE,this.name);}},{key:'render',value:function render(){this.$el.html(this.template({cid:this.cid,swfPath:this.swfPath,playbackId:this.uniqueId,wmode:this.options.rtmpConfig.wmode,scaling:this.options.rtmpConfig.scaling,bufferTime:this.options.rtmpConfig.bufferTime,playbackType:this.options.rtmpConfig.playbackType,startLevel:this.options.rtmpConfig.startLevel,autoSwitch:this.options.rtmpConfig.autoSwitch,switchRules:this._switchRulesJSON,useAppInstance:this.options.rtmpConfig.useAppInstance,proxyType:this.options.rtmpConfig.proxyType}));if(_clappr.Browser.isIE){this.$('embed').remove();if(_clappr.Browser.isLegacyIE){this.$el.attr('classid',IE_CLASSID);}}else if(_clappr.Browser.isFirefox){this._setupFirefox();}this.el.id = this.cid;var style=_clappr.Styler.getStyleFor(_rawSassPublicFlashScss2['default']);this.$el.append(style);return this;}},{key:'_checkState',value:function _checkState(){_get(Object.getPrototypeOf(RTMP.prototype),'_checkState',this).call(this);if(this.el.getState() === "PLAYING"){this.trigger(_clappr.Events.PLAYBACK_PLAY,this.name);}else if(this.el.getState() === "ERROR"){this.trigger(_clappr.Events.PLAYBACK_ERROR,this.name);}}},{key:'_playbackReady',value:function _playbackReady(){this._isReadyState = true;this.trigger(_clappr.Events.PLAYBACK_READY,this.name);}},{key:'_reporLevels',value:function _reporLevels(){if(this.isDynamicStream){if(this.levels){if(this.options.rtmpConfig.autoSwitch === true){this.trigger(_clappr.Events.PLAYBACK_LEVELS_AVAILABLE,this.levels,-1);this.trigger(_clappr.Events.PLAYBACK_BITRATE,{level:this.currentLevel});}else {this.trigger(_clappr.Events.PLAYBACK_LEVELS_AVAILABLE,this.levels,this.options.rtmpConfig.startLevel);}}}}},{key:'swfPath',get:function get(){return this.options.rtmpConfig.swfPath;}},{key:'currentLevel',get:function get(){if(this._isReadyState){return this.el.getCurrentLevel();}return undefined;},set:function set(level){this.el.setLevel(level);if(level === -1 && level !== this.currentLevel){this.trigger(_clappr.Events.PLAYBACK_LEVEL_SWITCH_END);this.trigger(_clappr.Events.PLAYBACK_BITRATE,{level:this.currentLevel});}}},{key:'numLevels',get:function get(){if(this._isReadyState){return this.el.getNumLevels();}return undefined;}},{key:'autoSwitchLevels',get:function get(){return this.el.isAutoSwitchLevels();}},{key:'levels',get:function get(){var levels=[];for(var i=0;i < this.numLevels;i++) {var bitrate=this.el.getBitrateForLevel(i);levels.push({id:i,label:bitrate + "Kbps"});}return levels;}},{key:'isDynamicStream',get:function get(){return this.el.isDynamicStream();}},{key:'_switchRulesJSON',get:function get(){if(this.options.rtmpConfig.switchRules !== undefined){return JSON.stringify(this.options.rtmpConfig.switchRules).replace(/"/g,'&quot;');}return "";}}]);return RTMP;})(_clappr.Flash);exports['default'] = RTMP;RTMP.canPlay = function(source){return !!((source.indexOf('rtmp://') > -1 || source.indexOf('rtmps://') > -1 || source.indexOf('.smil') > -1) && _clappr.Browser.hasFlash);};RTMP.debug = function(s){return console.log(s);};module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "<param name=\"movie\" value=\"<%= swfPath %>?inline=1\">\n<param name=\"quality\" value=\"autohigh\">\n<param name=\"swliveconnect\" value=\"true\">\n<param name=\"allowScriptAccess\" value=\"always\">\n<param name=\"allownetworking\" value=\"all\">\n<param name=\"bgcolor\" value=\"#000000\">\n<param name=\"allowFullScreen\" value=\"false\">\n<param name=\"wmode\" value=\"<%= wmode %>\">\n<param name=\"tabindex\" value=\"1\">\n<param name=FlashVars value=\"playbackId=<%= playbackId %>&scaling=<%= scaling %>&bufferTime=<%= bufferTime %>&playbackType=<%= playbackType %>&startLevel=<%= startLevel %>&useAppInstance=<%= useAppInstance %>&proxyType=<%= proxyType %>&autoSwitch=<%= autoSwitch %>&switchRules=<%= switchRules %>\"/>\n<embed\n  name=\"<%= cid %>\"\n  type=\"application/x-shockwave-flash\"\n  disabled=\"disabled\"\n  tabindex=\"-1\"\n  enablecontextmenu=\"false\"\n  allowScriptAccess=\"always\"\n  allownetworking=\"all\"\n  quality=\"autohigh\"\n  pluginspage=\"http://www.macromedia.com/go/getflashplayer\"\n  wmode=\"<%= wmode %>\"\n  swliveconnect=\"true\"\n  allowfullscreen=\"false\"\n  bgcolor=\"#000000\"\n  FlashVars=\"playbackId=<%= playbackId %>&scaling=<%= scaling %>&bufferTime=<%= bufferTime %>&playbackType=<%= playbackType %>&startLevel=<%= startLevel %>&useAppInstance=<%= useAppInstance %>&proxyType=<%= proxyType %>&autoSwitch=<%= autoSwitch %>&switchRules=<%= switchRules %>\"\n  src=\"<%= swfPath %>\"\n  width=\"100%\"\n  height=\"100%\">\n</embed>\n";

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = ".clappr-flash-playback[data-flash-playback] {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  pointer-events: none; }\n"

/***/ }
/******/ ])
});
;