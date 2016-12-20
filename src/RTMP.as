package {
  import flash.display.Sprite;
  import flash.external.ExternalInterface;
  import flash.system.Security;
  import flash.net.NetStream;
  import flash.events.*;
  import flash.utils.setTimeout;
  import flash.display.StageAlign;

  import org.osmf.containers.MediaContainer;
  import org.osmf.elements.VideoElement;
  import org.osmf.display.ScaleMode;
  import org.osmf.layout.LayoutMetadata;
  import org.osmf.layout.LayoutMode;
  import org.osmf.layout.HorizontalAlign;
  import org.osmf.layout.VerticalAlign;
  import flash.display.StageScaleMode;
  import flash.display.StageAlign;

  import org.osmf.net.NetStreamLoadTrait;
  import org.osmf.net.StreamingURLResource;
  import org.osmf.net.StreamType;
  import org.osmf.metadata.MetadataNamespaces

  import org.osmf.logging.Log;

  import org.osmf.media.*;
  import org.osmf.events.*;

  import org.osmf.traits.MediaTraitType;

  import org.osmf.smil.SMILPluginInfo;

  CONFIG::LOGGING {
    import logging.ExternalLoggerFactory;
    import org.osmf.logging.Logger;
    import org.osmf.logging.Log;
  }


  [SWF(width="640", height="360")]
  public class RTMP extends Sprite {
    private var playbackId:String;
    private var mediaFactory:DefaultMediaFactory;
    private var mediaContainer:MediaContainer;
    private var videoElement:VideoElement;
    private var mediaPlayer:MediaPlayer;
    private var netStream:NetStream;
    private var mediaElement:MediaElement;
    private var netStreamLoadTrait:NetStreamLoadTrait;
    private var urlResource:StreamingURLResource;
    private var playbackState:String = "IDLE";
    private var isLive:Boolean = false;
    private var useAppInstance:Boolean = false;
    private var proxyType:String = "none";

    CONFIG::LOGGING {
      private static const logInit:Boolean = initLog();
      private static const logger:Logger = org.osmf.logging.Log.getLogger("RTMP");

      private static function initLog():Boolean {
        Log.loggerFactory = new ExternalLoggerFactory();
        return true;
      }
    }


    public function RTMP() {
      Security.allowDomain('*');
      Security.allowInsecureDomain('*');

      playbackId = this.root.loaderInfo.parameters.playbackId;
      isLive = this.root.loaderInfo.parameters.playbackType == 'live';
      useAppInstance = this.root.loaderInfo.parameters.useAppInstance == 'true';
      proxyType = this.root.loaderInfo.parameters.proxyType;
      mediaFactory = new DefaultMediaFactory();
      mediaContainer = new MediaContainer();

      //set mediaContainer layout
      mediaContainer.clipChildren = true;
      mediaContainer.layoutMetadata.percentWidth = 100;
      mediaContainer.layoutMetadata.percentHeight = 100;
      mediaContainer.width = stage.stageWidth;
      mediaContainer.height = stage.stageHeight;

      stage.align = StageAlign.TOP;
      stage.scaleMode = StageScaleMode.NO_SCALE; //We handle scaling ourselves

      stage.addEventListener(Event.RESIZE, _onStageResize);

      setupCallbacks();
      setupGetters();

      _triggerEvent('flashready');

      stage.scaleMode = StageScaleMode.NO_SCALE;
      stage.align = StageAlign.TOP_LEFT;

      if (stage) {
        resize();
      } else {
        addEventListener(Event.ADDED_TO_STAGE, resize);
      }

      stage.addEventListener(Event.RESIZE, resize);
    }

    private function resize(e:Event = null):void {
      if(mediaElement && mediaContainer && stage){
        mediaContainer.width = stage.stageWidth;
        mediaContainer.height = stage.stageHeight;
        setScaleMode(mediaElement, stage.stageWidth, stage.stageHeight);
      }
    }

    private function setupCallbacks():void {
      ExternalInterface.addCallback("playerPlay", playerPlay);
      ExternalInterface.addCallback("playerResume", playerPlay);
      ExternalInterface.addCallback("playerPause", playerPause);
      ExternalInterface.addCallback("playerStop", playerStop);
      ExternalInterface.addCallback("playerSeek", playerSeek);
      ExternalInterface.addCallback("playerVolume", playerVolume);
      ExternalInterface.addCallback("playerScaling", playerScaling);
      ExternalInterface.addCallback("setLevel", setLevel);
    }

    private function setupGetters():void {
      ExternalInterface.addCallback("getState", getState);
      ExternalInterface.addCallback("getPosition", getPosition);
      ExternalInterface.addCallback("getDuration", getDuration);
      ExternalInterface.addCallback("getCurrentLevel", getCurrentLevel);
      ExternalInterface.addCallback("getBytesLoaded", getBytesLoaded);
      ExternalInterface.addCallback("getBytesTotal", getBytesTotal);
      ExternalInterface.addCallback("getNumLevels", getNumLevels);
      ExternalInterface.addCallback("getBitrateForLevel", getBitrateForLevel);
      ExternalInterface.addCallback("isDynamicStream", isDynamicStream);
      ExternalInterface.addCallback("isAutoSwitchLevels", isAutoSwitchLevels);
    }

    private function getBytesTotal():Number {
      if (netStream) {
        return netStream.bytesTotal;
      }
      else {
          return 0;
      }
    }
    private function getBytesLoaded():Number {
        if (netStream) {
          return netStream.bytesLoaded;
        }
        else {
            return 0;
        }
    }

    private function onTraitAdd(event:MediaElementEvent):void {
      if (mediaElement.hasTrait(MediaTraitType.LOAD)) {
        netStreamLoadTrait = mediaElement.getTrait(MediaTraitType.LOAD) as NetStreamLoadTrait;
        netStreamLoadTrait.addEventListener(LoadEvent.LOAD_STATE_CHANGE, onLoaded);
      }
    }

    private function onLoaded(event:LoadEvent):void {
      _triggerEvent("onloaded")
      netStream = netStreamLoadTrait.netStream;
      netStream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
      mediaPlayer.play();
    }

    private function netStatusHandler(event:NetStatusEvent):void {
      if (playbackState == "ENDED") {
        return;
      } else if (event.info.code == "NetStream.Buffer.Full") {
        _changeStateAndNotify('PLAYING');
      } else if (event.info.code == "NetStream.Buffer.Empty" || event.info.code == "NetStream.Seek.Notify") {
        _changeStateAndNotify('PLAYING_BUFFERING');
      }
    }

    private function setScaleMode(mediaElement:MediaElement, width:Number, height:Number):void {
      var layout:LayoutMetadata = new LayoutMetadata();
      layout.width  = width;
      layout.height = height;
      layout.layoutMode = LayoutMode.HORIZONTAL;
      layout.horizontalAlign = HorizontalAlign.CENTER;
      layout.verticalAlign = VerticalAlign.MIDDLE;
      layout.scaleMode = ScaleMode.LETTERBOX;

      mediaElement.removeMetadata(LayoutMetadata.LAYOUT_NAMESPACE);
      mediaElement.addMetadata(LayoutMetadata.LAYOUT_NAMESPACE, layout);
    }

    private function playerPlay(url:String=null):void {
      try {
        if (!mediaElement) {
          var streamType:String = (isLive ? StreamType.LIVE : StreamType.RECORDED);

          urlResource = new StreamingURLResource(url, streamType, NaN, NaN, null, useAppInstance, null, proxyType);

          var startLevel:int = int(this.root.loaderInfo.parameters.startLevel);

          if (this.root.loaderInfo.parameters.switchRules != "") {
            var switchRules:Object = JSON.parse(this.root.loaderInfo.parameters.switchRules.replace(/&quote;/g, '"'));
            urlResource.addMetadataValue(MetadataNamespaces.RESOURCE_INITIAL_SWITCH_RULES, switchRules);
          }

          if (startLevel > -1) {
            urlResource.addMetadataValue(MetadataNamespaces.RESOURCE_INITIAL_INDEX, startLevel);
          }

          var pluginResource:MediaResourceBase = new PluginInfoResource(new SMILPluginInfo());

          // Load the plugin.
          mediaFactory.loadPlugin(pluginResource);

          //create new MediaPlayer - it controls your media provided in media property
          mediaPlayer = new MediaPlayer();

          mediaPlayer.bufferTime = this.root.loaderInfo.parameters.bufferTime;
          mediaPlayer.autoPlay = false;
          mediaPlayer.autoDynamicStreamSwitch = this.root.loaderInfo.parameters.autoSwitch == 'true';
          mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeUpdated);
          mediaPlayer.addEventListener(TimeEvent.DURATION_CHANGE, onTimeUpdated);
          mediaPlayer.addEventListener(TimeEvent.COMPLETE, onFinish);
          mediaPlayer.addEventListener(MediaErrorEvent.MEDIA_ERROR, onMediaError);
          mediaPlayer.addEventListener(DynamicStreamEvent.SWITCHING_CHANGE, onLevelSwitching);

          mediaElement = mediaFactory.createMediaElement(urlResource);
          mediaElement.addEventListener(MediaElementEvent.TRAIT_ADD, onTraitAdd);

          mediaContainer.addMediaElement(mediaElement);

          mediaPlayer.media = mediaElement;

          //Set the player scaling
          playerScaling(this.root.loaderInfo.parameters.scaling);

          addChild(mediaContainer);
          resize();

          _changeStateAndNotify('PLAYING_BUFFERING')
          _triggerEvent('playbackready');
        } else {
          mediaPlayer.play();
          _changeStateAndNotify('PLAYING')
        }
      } catch (err:Error) {
        debugLog('Catch error: ' + err.messsage);
        _changeStateAndNotify('ERROR')
      }
    }

    private function onLevelSwitching(event:DynamicStreamEvent):void {
      if (event.switching) {
        _triggerEvent('levelChanging');
      }
      else {
        _triggerEvent('levelChanged');
      }
    }

    private function onMediaError(event:MediaErrorEvent):void {
      debugLog("MediaPlayer error: " + event.toString());
    }

    private function playerPause():void {
      mediaPlayer.pause();
      _changeStateAndNotify('PAUSED')
    }

    private function playerSeek(seconds:Number):void {
      mediaPlayer.seek(seconds);
    }

    private function playerStop():void {
      mediaPlayer.stop();
      _changeStateAndNotify('IDLE')
    }

    private function playerVolume(level:Number):void {
      mediaPlayer.volume = level/100;
    }

    private function playerScaling(scaling: String):void {
      if(!mediaElement) return;

      //layoutMetadata needs to be added to the mediaElement depicting what scaling the video should have
      var layoutMetadata:LayoutMetadata = new LayoutMetadata();
      layoutMetadata.percentWidth = 100;
      layoutMetadata.percentHeight = 100;

      //The following is required for correct alignment in letterbox scaling
      layoutMetadata.layoutMode = LayoutMode.HORIZONTAL
      layoutMetadata.horizontalAlign = HorizontalAlign.CENTER;
      layoutMetadata.verticalAlign = VerticalAlign.TOP;

      switch(scaling){
       case 'stretch':
         layoutMetadata.scaleMode = ScaleMode.STRETCH;
         break;
       case 'zoom':
         layoutMetadata.scaleMode = ScaleMode.ZOOM;
         break;
       case 'none':
         layoutMetadata.scaleMode = ScaleMode.NONE;
         break;
       //Letterbox is the default scale mode
       case 'letterbox':
       default:
         layoutMetadata.scaleMode = ScaleMode.LETTERBOX;
         break;
      }

      //Assign layoutMetadata to mediaElement
      mediaElement.addMetadata(LayoutMetadata.LAYOUT_NAMESPACE, layoutMetadata);
    }

    private function setLevel(level:int):void {
      if (level == -1) {
        mediaPlayer.autoDynamicStreamSwitch = true;
      }
      else {
        mediaPlayer.autoDynamicStreamSwitch = false;
        mediaPlayer.switchDynamicStreamIndex(level);
      }
    }

    private function getState():String {
      return playbackState;
    }

    private function getPosition():Number {
      if (isLive) return 1;
      return mediaPlayer.currentTime;
    }

    private function getDuration():Number {
      if (isLive) return 1;
      return mediaPlayer.duration;
    }

    private function getCurrentLevel():Number {
      return mediaPlayer.currentDynamicStreamIndex;
    }

    private function getNumLevels():Number {
      return mediaPlayer.numDynamicStreams;
    }

    private function getBitrateForLevel(i:Number):Number {
      return mediaPlayer.getBitrateForDynamicStreamIndex(i);
    }

    private function isDynamicStream():Boolean {
      return mediaPlayer.isDynamicStream;
    }

    private function isAutoSwitchLevels():Boolean {
      return mediaPlayer.autoDynamicStreamSwitch;
    }

    private function onTimeUpdated(event:TimeEvent):void {
      _triggerEvent('progress');
      _triggerEvent('timeupdate');
    }

    private function onFinish(event:TimeEvent):void {
      mediaPlayer.stop();
      _changeStateAndNotify('ENDED')
    }

    protected function _onStageResize(event : Event) : void {
      mediaContainer.width = stage.stageWidth;
      mediaContainer.height = stage.stageHeight;
    }

    private function _triggerEvent(name: String):void {
      ExternalInterface.call('Clappr.Mediator.trigger("' + playbackId + ':' + name +'")');
    }

    private function debugLog(msg:String):void {
      CONFIG::LOGGING {
        if (logger != null) {
          logger.info(msg);
        }
      }
    }

    private function _changeStateAndNotify(state: String):void {
      playbackState = state;
      _triggerEvent('statechanged');
    }
  }
}
