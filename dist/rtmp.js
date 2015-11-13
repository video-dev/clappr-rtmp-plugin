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
	'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if('value' in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();var _get=function get(_x,_x2,_x3){var _again=true;_function: while(_again) {var object=_x,property=_x2,receiver=_x3;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}}else if('value' in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _clappr=__webpack_require__(2);var _clapprSrcBaseTemplate=__webpack_require__(3);var _clapprSrcBaseTemplate2=_interopRequireDefault(_clapprSrcBaseTemplate);var _htmlPublicFlashHtml=__webpack_require__(4);var _htmlPublicFlashHtml2=_interopRequireDefault(_htmlPublicFlashHtml);var _rawSassPublicFlashScss=__webpack_require__(5);var _rawSassPublicFlashScss2=_interopRequireDefault(_rawSassPublicFlashScss);var RTMP=(function(_Flash){_inherits(RTMP,_Flash);_createClass(RTMP,[{key:'name',get:function get(){return 'rtmp';}},{key:'tagName',get:function get(){return 'object';}},{key:'template',get:function get(){return (0,_clapprSrcBaseTemplate2['default'])(_htmlPublicFlashHtml2['default']);}},{key:'attributes',get:function get(){return {'data-rtmp':'','type':'application/x-shockwave-flash','width':'100%','height':'100%'};}}]);function RTMP(options){_classCallCheck(this,RTMP);_get(Object.getPrototypeOf(RTMP.prototype),'constructor',this).call(this,options);this.options = options;this.options.rtmpConfig = this.options.rtmpConfig || {};this.options.rtmpConfig.swfPath = this.options.rtmpConfig.swfPath || '//cdn.jsdelivr.net/clappr.rtmp/latest/assets/RTMP.swf';this.options.rtmpConfig.wmode = this.options.rtmpConfig.wmode || 'transparent'; // Default to transparent wmode - IE always uses gpu as per objectIE
	this.options.rtmpConfig.bufferTime = this.options.rtmpConfig.bufferTime || 0.1;this.options.rtmpConfig.scaling = this.options.rtmpConfig.scaling || 'letterbox';this.options.rtmpConfig.playbackType = this.options.rtmpConfig.playbackType || this.options.src.indexOf('live') > -1;this.options.rtmpConfig.startLevel = this.options.rtmpConfig.startLevel || 0;this.setupPlaybackType();}_createClass(RTMP,[{key:'getPlaybackType',value:function getPlaybackType(){return this.options.rtmpConfig.playbackType;}},{key:'addListeners',value:function addListeners(){_clappr.Mediator.on(this.uniqueId + ':progress',this.progress,this);_clappr.Mediator.on(this.uniqueId + ':timeupdate',this.updateTime,this);_clappr.Mediator.on(this.uniqueId + ':statechanged',this.checkState,this);_clappr.Mediator.on(this.uniqueId + ':levelChanged',this.levelChange,this);_clappr.Mediator.on(this.uniqueId + ':flashready',this.bootstrap,this);}},{key:'stopListening',value:function stopListening(){_get(Object.getPrototypeOf(RTMP.prototype),'stopListening',this).call(this);_clappr.Mediator.off(this.uniqueId + ':progress');_clappr.Mediator.off(this.uniqueId + ':timeupdate');_clappr.Mediator.off(this.uniqueId + ':statechanged');_clappr.Mediator.off(this.uniqueId + ':flashready');}},{key:'bootstrap',value:function bootstrap(){this.el.width = '100%';this.el.height = '100%';this.isReady = true;this.trigger(_clappr.Events.PLAYBACK_READY,this.name);this.options.autoPlay && this.play();}},{key:'updateTime',value:function updateTime(){if(this.getPlaybackType() === 'live'){this.trigger(_clappr.Events.PLAYBACK_TIMEUPDATE,1,1,this.name);}else {this.trigger(_clappr.Events.PLAYBACK_TIMEUPDATE,this.el.getPosition(),this.el.getDuration(),this.name);}}},{key:'levelChange',value:function levelChange(){var data={level:this.currentLevel};this.trigger(_clappr.Events.PLAYBACK_LEVEL_SWITCH,data);var currentLevel=this.levels[data.level];if(currentLevel){this.trigger(_clappr.Events.PLAYBACK_BITRATE,{bitrate:currentLevel.bitrate,level:data.level});}}},{key:'setupPlaybackType',value:function setupPlaybackType(){if(this.getPlaybackType() === 'live'){this.settings = {'left':["playpause"],'default':['seekbar'],'right':['fullscreen','volume']};this.settings.seekEnabled = false;this.trigger(_clappr.Events.PLAYBACK_SETTINGSUPDATE);}}},{key:'render',value:function render(){this.$el.html(this.template({cid:this.cid,swfPath:this.swfPath,playbackId:this.uniqueId,wmode:this.options.rtmpConfig.wmode,scaling:this.options.rtmpConfig.scaling,bufferTime:this.options.rtmpConfig.bufferTime,playbackType:this.options.rtmpConfig.playbackType,startLevel:this.options.rtmpConfig.startLevel}));if(_clappr.Browser.isIE){this.$('embed').remove();if(_clappr.Browser.isLegacyIE){this.$el.attr('classid',IE_CLASSID);}}else if(_clappr.Browser.isFirefox){this.setupFirefox();}this.el.id = this.cid;var style=_clappr.Styler.getStyleFor(_rawSassPublicFlashScss2['default']);this.$el.append(style);return this;}},{key:'checkState',value:function checkState(){_get(Object.getPrototypeOf(RTMP.prototype),'checkState',this).call(this);if(this.isDynamicStream){this.trigger(_clappr.Events.PLAYBACK_FRAGMENT_LOADED);}}},{key:'swfPath',get:function get(){return this.options.rtmpConfig.swfPath;}},{key:'currentLevel',get:function get(){return this.el.getCurrentLevel();},set:function set(level){this.el.setLevel(level);}},{key:'numLevels',get:function get(){return this.el.getNumLevels();}},{key:'autoSwitchLevels',get:function get(){return this.el.isAutoSwitchLevels();}},{key:'levels',get:function get(){var levels=[];for(var i=0;i < this.numLevels;i++) {var bitrate=this.el.getBitrateForLevel(i);levels.push({bitrate:bitrate * 1000, // KBytes to Bytes
	label:bitrate});}return levels;}},{key:'isDynamicStream',get:function get(){return this.el.isDynamicStream();}}]);return RTMP;})(_clappr.Flash);exports['default'] = RTMP;RTMP.canPlay = function(source){return !!((source.indexOf('rtmp://') > -1 || source.indexOf('.smil') > -1) && _clappr.Browser.hasFlash);};RTMP.debug = function(s){return console.log(s);};module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Simple JavaScript Templating
	// Paul Miller (http://paulmillr.com)
	// http://underscorejs.org
	"use strict";(function(globals){ // By default, Underscore uses ERB-style template delimiters, change the
	// following template settings to use alternative delimiters.
	var settings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g}; // When customizing `templateSettings`, if you don't want to define an
	// interpolation, evaluation or escaping regex, we need one that is
	// guaranteed not to match.
	var noMatch=/(.)^/; // Certain characters need to be escaped so that they can be put into a
	// string literal.
	var escapes={"'":"'",'\\':'\\','\r':'r','\n':'n','\t':'t',"\u2028":'u2028',"\u2029":'u2029'};var escaper=/\\|'|\r|\n|\t|\u2028|\u2029/g; // List of HTML entities for escaping.
	var htmlEntities={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'};var entityRe=new RegExp('[&<>"\']','g');var escapeExpr=function escapeExpr(string){if(string == null)return '';return ('' + string).replace(entityRe,function(match){return htmlEntities[match];});};var counter=0; // JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	var tmpl=function tmpl(text,data){var render; // Combine delimiters into one regular expression via alternation.
	var matcher=new RegExp([(settings.escape || noMatch).source,(settings.interpolate || noMatch).source,(settings.evaluate || noMatch).source].join('|') + '|$','g'); // Compile the template source, escaping string literals appropriately.
	var index=0;var source="__p+='";text.replace(matcher,function(match,escape,interpolate,evaluate,offset){source += text.slice(index,offset).replace(escaper,function(match){return '\\' + escapes[match];});if(escape){source += "'+\n((__t=(" + escape + "))==null?'':escapeExpr(__t))+\n'";}if(interpolate){source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";}if(evaluate){source += "';\n" + evaluate + "\n__p+='";}index = offset + match.length;return match;});source += "';\n"; // If a variable is not specified, place data values in local scope.
	if(!settings.variable)source = 'with(obj||{}){\n' + source + '}\n';source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n//# sourceURL=/microtemplates/source[" + counter++ + "]";try{render = new Function(settings.variable || 'obj','escapeExpr',source);}catch(e) {e.source = source;throw e;}if(data)return render(data,escapeExpr);var template=function template(data){return render.call(this,data,escapeExpr);}; // Provide the compiled function source as a convenience for precompilation.
	template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';return template;};tmpl.settings = settings;if(true){!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return tmpl;}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // RequireJS
	}else if(typeof module !== 'undefined' && module.exports){module.exports = tmpl; // CommonJS
	}else {globals.microtemplate = tmpl; // <script>
	}})(undefined); // (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "<param name=\"movie\" value=\"<%= swfPath %>?inline=1\">\n<param name=\"quality\" value=\"autohigh\">\n<param name=\"swliveconnect\" value=\"true\">\n<param name=\"allowScriptAccess\" value=\"always\">\n<param name=\"allownetworking\" value=\"all\">\n<param name=\"bgcolor\" value=\"#000000\">\n<param name=\"allowFullScreen\" value=\"false\">\n<param name=\"wmode\" value=\"<%= wmode %>\">\n<param name=\"tabindex\" value=\"1\">\n<param name=FlashVars value=\"playbackId=<%= playbackId %>&scaling=<%= scaling %>&bufferTime=<%= bufferTime %>&playbackType=<%= playbackType %>&startLevel=<%= startLevel %>\" />\n<embed\n  name=\"<%= cid %>\"\n  type=\"application/x-shockwave-flash\"\n  disabled=\"disabled\"\n  tabindex=\"-1\"\n  enablecontextmenu=\"false\"\n  allowScriptAccess=\"always\"\n  allownetworking=\"all\"\n  quality=\"autohigh\"\n  pluginspage=\"http://www.macromedia.com/go/getflashplayer\"\n  wmode=\"<%= wmode %>\"\n  swliveconnect=\"true\"\n  allowfullscreen=\"false\"\n  bgcolor=\"#000000\"\n  FlashVars=\"playbackId=<%= playbackId %>&scaling=<%= scaling %>&bufferTime=<%= bufferTime %>&playbackType=<%= playbackType %>&startLevel=<%= startLevel %>\"\n  src=\"<%= swfPath %>\"\n  width=\"100%\"\n  height=\"100%\">\n</embed>";

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = ".clappr-flash-playback[data-flash-playback] {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  pointer-events: none; }\n"

/***/ }
/******/ ])
});
;