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

      ExternalInterface.call('console.log', 'clappr rtmp 0.10-alpha');

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
      ExternalInterface.addCallback("setAutoSwitchLevels", setAutoSwitchLevels);
    }

    private function setupGetters():void {
      ExternalInterface.addCallback("getState", getState);
      ExternalInterface.addCallback("getPosition", getPosition);
      ExternalInterface.addCallback("getDuration", getDuration);
      ExternalInterface.addCallback("getCurrentLevel", getCurrentLevel);
      ExternalInterface.addCallback("isDynamicStream", isDynamicStream);
      ExternalInterface.addCallback("isAutoSwitchLevels", isAutoSwitchLevels);
    }

    private function onTraitAdd(event:MediaElementEvent):void {
      if (mediaElement.hasTrait(MediaTraitType.LOAD)) {
        netStreamLoadTrait = mediaElement.getTrait(MediaTraitType.LOAD) as NetStreamLoadTrait;
        netStreamLoadTrait.addEventListener(LoadEvent.LOAD_STATE_CHANGE, onLoaded);
      }
    }

    private function onLoaded(event:LoadEvent):void {
      netStream = netStreamLoadTrait.netStream;
      netStream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
      mediaPlayer.play();
    }

    private function netStatusHandler(event:NetStatusEvent):void {
      if (playbackState == "ENDED") {
        return;
      } else if (event.info.code == "NetStream.Buffer.Full") {
        playbackState = "PLAYING";
        _triggerEvent('statechanged');
      } else if (event.info.code == "NetStream.Buffer.Empty" || event.info.code == "NetStream.Seek.Notify") {
        playbackState = "PLAYING_BUFFERING";
        _triggerEvent('statechanged');
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
      if (!mediaElement) {
        playbackState = "PLAYING_BUFFERING";
        _triggerEvent('statechanged');

        if (isLive) {
          urlResource = new StreamingURLResource(url, StreamType.LIVE);
        } else {
          urlResource = new StreamingURLResource(url, StreamType.RECORDED);
        }

        var sl1:int = int(this.root.loaderInfo.parameters.startLevel);
        urlResource.addMetadataValue(MetadataNamespaces.RESOURCE_INITIAL_INDEX, sl1);

        var pluginResource:MediaResourceBase = new PluginInfoResource(new SMILPluginInfo());

        // Load the plugin.
        mediaFactory.loadPlugin(pluginResource);

        //create new MediaPlayer - it controls your media provided in media property
        mediaPlayer = new MediaPlayer();

        mediaPlayer.bufferTime = this.root.loaderInfo.parameters.bufferTime;
        mediaPlayer.autoPlay = false;
        mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeUpdated);
        mediaPlayer.addEventListener(TimeEvent.DURATION_CHANGE, onTimeUpdated);
        mediaPlayer.addEventListener(TimeEvent.COMPLETE, onFinish);
        mediaPlayer.addEventListener(MediaErrorEvent.MEDIA_ERROR, onMediaError);

        mediaElement = mediaFactory.createMediaElement(urlResource);
        mediaElement.addEventListener(MediaElementEvent.TRAIT_ADD, onTraitAdd);

        mediaContainer.addMediaElement(mediaElement);

        mediaPlayer.media = mediaElement;

        //Set the player scaling
        playerScaling(this.root.loaderInfo.parameters.scaling);

        addChild(mediaContainer);
        resize();
      } else {
        mediaPlayer.play();
      }
    }

    private function onMediaError(event:MediaErrorEvent):void {
      debugLog("MediaPlayer error: " + event.toString());
    }

    private function playerPause():void {
      mediaPlayer.pause();

      debugLog("pausing playback");
      playbackState = "PAUSED";
    }

    private function playerSeek(seconds:Number):void {
      mediaPlayer.seek(seconds);
    }

    private function playerStop():void {
      mediaPlayer.stop();
      playbackState = "IDLE";
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
      mediaPlayer.autoDynamicStreamSwitch = false;
      mediaPlayer.switchDynamicStreamIndex(level);
    }

    private function setAutoSwitchLevels(auto:Boolean):void {
      mediaPlayer.autoDynamicStreamSwitch = auto;
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
      playbackState = 'ENDED';
      _triggerEvent('statechanged');
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
  }
}
