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

	'use strict';function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _srcMain=__webpack_require__(1);var _srcMain2=_interopRequireDefault(_srcMain);module.exports = window.RTMP = _srcMain2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2014 Globo.com Player authors. All rights reserved.
	// Use of this source code is governed by a BSD-style
	// license that can be found in the LICENSE file.
	'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if('value' in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();var _get=function get(_x,_x2,_x3){var _again=true;_function: while(_again) {var object=_x,property=_x2,receiver=_x3;desc = parent = getter = undefined;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;}}else if('value' in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _clappr=__webpack_require__(2);var RTMP=(function(_Flash){_inherits(RTMP,_Flash);_createClass(RTMP,[{key:'name',get:function get(){return 'rtmp';}},{key:'tagName',get:function get(){return 'object';}},{key:'attributes',get:function get(){return {'data-rtmp':'','type':'application/x-shockwave-flash','width':'100%','height':'100%'};}}]);function RTMP(options){_classCallCheck(this,RTMP);_get(Object.getPrototypeOf(RTMP.prototype),'constructor',this).call(this,options);this.options = options;this.setupPlaybackType();}_createClass(RTMP,[{key:'addListeners',value:function addListeners(){_clappr.Mediator.on(this.uniqueId + ':progress',this.progress,this);_clappr.Mediator.on(this.uniqueId + ':timeupdate',this.updateTime,this);_clappr.Mediator.on(this.uniqueId + ':statechanged',this.checkState,this);_clappr.Mediator.on(this.uniqueId + ':flashready',this.bootstrap,this);}},{key:'stopListening',value:function stopListening(){_get(Object.getPrototypeOf(RTMP.prototype),'stopListening',this).call(this);_clappr.Mediator.off(this.uniqueId + ':progress');_clappr.Mediator.off(this.uniqueId + ':timeupdate');_clappr.Mediator.off(this.uniqueId + ':statechanged');_clappr.Mediator.off(this.uniqueId + ':flashready');}},{key:'bootstrap',value:function bootstrap(){this.el.width = '100%';this.el.height = '100%';this.isReady = true;this.trigger(_clappr.Events.PLAYBACK_READY,this.name);this.options.autoPlay && this.play();}},{key:'getPlaybackType',value:function getPlaybackType(){return this.playbackType;}},{key:'setupPlaybackType',value:function setupPlaybackType(){if(this.options.src.indexOf('live') > -1){this.playbackType = 'live';this.settings = {'left':["playstop"],'default':['seekbar'],'right':['fullscreen','volume']};this.settings.seekEnabled = false;this.trigger(_clappr.Events.PLAYBACK_SETTINGSUPDATE);}else {this.playbackType = 'vod';}}},{key:'swfPath',get:function get(){return "http://cdn.jsdelivr.net/clappr.rtmp/latest/assets/RTMP.swf";}}]);return RTMP;})(_clappr.Flash);exports['default'] = RTMP;RTMP.canPlay = function(source){return !!(source.indexOf('rtmp://') > -1 && _clappr.Browser.hasFlash);};module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;