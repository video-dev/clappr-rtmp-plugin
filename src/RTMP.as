package {
  import flash.display.Sprite;
  import flash.external.ExternalInterface;
  import flash.system.Security;
  import flash.net.NetStream;
  import flash.events.*;
  import flash.utils.setTimeout;

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

  import org.osmf.media.DefaultMediaFactory;
  import org.osmf.media.MediaElement;
  import org.osmf.media.MediaPlayer;

  import org.osmf.events.TimeEvent;
  import org.osmf.events.BufferEvent;
  import org.osmf.events.MediaElementEvent;
  import org.osmf.events.LoadEvent;

  import org.osmf.traits.MediaTraitType;

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

    public function RTMP() {
      Security.allowDomain('*');
      Security.allowInsecureDomain('*');
      playbackId = this.root.loaderInfo.parameters.playbackId;
      mediaFactory = new DefaultMediaFactory();
      mediaContainer = new MediaContainer();

      //set mediaContainer layout
	  mediaContainer.clipChildren = true;
	  mediaContainer.layoutMetadata.percentWidth = 100;
	  mediaContainer.layoutMetadata.percentHeight = 100;

	  stage.align = StageAlign.TOP_LEFT;
	  stage.scaleMode = StageScaleMode.NO_SCALE; //We handle scaling ourselves

	  stage.addEventListener(Event.RESIZE, _onStageResize);

      setupCallbacks();
      setupGetters();
      ExternalInterface.call('console.log', 'clappr rtmp 0.9-alpha');
      _triggerEvent('flashready');
    }

    private function setupCallbacks():void {
      ExternalInterface.addCallback("playerPlay", playerPlay);
      ExternalInterface.addCallback("playerResume", playerPlay);
      ExternalInterface.addCallback("playerPause", playerPause);
      ExternalInterface.addCallback("playerStop", playerStop);
      ExternalInterface.addCallback("playerSeek", playerSeek);
      ExternalInterface.addCallback("playerVolume", playerVolume);
      ExternalInterface.addCallback("playerScaling", playerScaling);
    }

    private function setupGetters():void {
      ExternalInterface.addCallback("getState", getState);
      ExternalInterface.addCallback("getPosition", getPosition);
      ExternalInterface.addCallback("getDuration", getDuration);
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

    private function playerPlay(url:String=null):void {
      if (!mediaElement) {
        playbackState = "PLAYING_BUFFERING";
        _triggerEvent('statechanged');
        if (url.indexOf('live') == -1) {
          urlResource = new StreamingURLResource(url, StreamType.RECORDED);
        } else {
          urlResource = new StreamingURLResource(url, StreamType.LIVE);
          isLive = true;
        }

        //create new VideoElement - it contains all the informations about the video
		videoElement = new VideoElement(urlResource);
		
		//if we want to have nicely smoothed and scaled video, just turn smoothing property on.
		videoElement.smoothing = true;

		//create new MediaPlayer - it controls your media provided in media property
		mediaPlayer = new MediaPlayer();

		mediaPlayer.media = videoElement;

        mediaPlayer.autoPlay = false;
        mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeUpdated);
        mediaPlayer.addEventListener(TimeEvent.DURATION_CHANGE, onTimeUpdated);
        mediaPlayer.addEventListener(TimeEvent.COMPLETE, onFinish);

        mediaElement = mediaContainer.addMediaElement(videoElement);
        mediaElement.addEventListener(MediaElementEvent.TRAIT_ADD, onTraitAdd);

        mediaContainer.width = stage.stageWidth;
	  	mediaContainer.height = stage.stageHeight;

        //Set the player scaling
        playerScaling(this.root.loaderInfo.parameters.scaling);

        addChild(mediaContainer);
      } else {
        mediaPlayer.play();
      }
    }

    private function playerPause():void {
      mediaPlayer.pause();
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
      layoutMetadata.verticalAlign = VerticalAlign.MIDDLE;
	  
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
  }
}
