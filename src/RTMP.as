package {
  import flash.display.Sprite;
  import flash.external.ExternalInterface;
  import flash.system.Security;
  import flash.net.NetStream;
  import flash.events.*;
  import flash.utils.setTimeout;

  import org.osmf.containers.MediaContainer;
  import org.osmf.elements.VideoElement;

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
      setupCallbacks();
      setupGetters();
      ExternalInterface.call('console.log', 'clappr rtmp 0.8-alpha');
      _triggerEvent('flashready');
    }

    private function setupCallbacks():void {
      ExternalInterface.addCallback("playerPlay", playerPlay);
      ExternalInterface.addCallback("playerResume", playerPlay);
      ExternalInterface.addCallback("playerPause", playerPause);
      ExternalInterface.addCallback("playerStop", playerStop);
      ExternalInterface.addCallback("playerSeek", playerSeek);
      ExternalInterface.addCallback("playerVolume", playerVolume);
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
        mediaElement = mediaFactory.createMediaElement(urlResource);
        mediaElement.addEventListener(MediaElementEvent.TRAIT_ADD, onTraitAdd);
        mediaPlayer = new MediaPlayer(mediaElement);
        mediaPlayer.autoPlay = false;
        mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeUpdated);
        mediaPlayer.addEventListener(TimeEvent.DURATION_CHANGE, onTimeUpdated);
        mediaPlayer.addEventListener(TimeEvent.COMPLETE, onFinish);
        mediaContainer.addMediaElement(mediaElement);
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

    private function _triggerEvent(name: String):void {
      ExternalInterface.call('Clappr.Mediator.trigger("' + playbackId + ':' + name +'")');
    }
  }
}
