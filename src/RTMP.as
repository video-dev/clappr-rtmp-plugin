package {
  import flash.display.Sprite;
  import flash.external.ExternalInterface;
  import flash.system.Security;
  import flash.net.NetStream;
  import flash.events.*;

  import org.osmf.containers.MediaContainer;
  import org.osmf.elements.VideoElement;
  import org.osmf.net.NetStreamLoadTrait;

  import org.osmf.media.DefaultMediaFactory;
  import org.osmf.media.MediaElement;
  import org.osmf.media.MediaPlayer;
  import org.osmf.media.URLResource;

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
    private var playbackState:String = "IDLE";

    public function RTMP() {
      Security.allowDomain('*');
      Security.allowInsecureDomain('*');
      playbackId = this.root.loaderInfo.parameters.playbackId;
      mediaFactory = new DefaultMediaFactory();
      mediaContainer = new MediaContainer();
      setupCallbacks();
      setupGetters();
      ExternalInterface.call('console.log', 'clappr rtmp 0.4-alpha');
      _triggerEvent('flashready');
    }

    private function setupCallbacks():void {
      ExternalInterface.addCallback("playerLoad", playerLoad);
      ExternalInterface.addCallback("playerPlay", playerPlay);
      ExternalInterface.addCallback("playerPause", playerPause);
      ExternalInterface.addCallback("playerStop", playerStop);
      ExternalInterface.addCallback("playerSeek", playerSeek);
    }

    private function setupGetters():void {
      ExternalInterface.addCallback("getState", getState);
      ExternalInterface.addCallback("getPosition", getPosition);
      ExternalInterface.addCallback("getDuration", getDuration);
    }

    private function playerLoad(url:String):void {
      mediaElement = mediaFactory.createMediaElement(new URLResource(url));
      mediaElement.addEventListener(MediaElementEvent.TRAIT_ADD, onTraitAdd);
      mediaPlayer = new MediaPlayer(mediaElement);
      mediaPlayer.autoPlay = false;
      mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeUpdated);
      mediaPlayer.addEventListener(TimeEvent.DURATION_CHANGE, onTimeUpdated);
      mediaContainer.addMediaElement(mediaElement);
      addChild(mediaContainer);
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
    }

    private function netStatusHandler(event:NetStatusEvent):void {
      ExternalInterface.call('console.log', 'new event:' + event.info.code);
      if (event.info.code === "NetStream.Buffer.Full") {
        playbackState = "PLAYING";
      } else if (isBuffering(event.info.code)) {
        playbackState = "PLAYING_BUFFERING";
      } else if (event.info.code == "NetStream.Play.Stop") {
        playbackState = "ENDED";
      } else if (event.info.code == "NetStream.Buffer.Empty") {
        playbackState = "BUFFERING";
      }
      _triggerEvent('statechanged');
    }

    private function isBuffering(code:String):Boolean {
      return Boolean(code == "NetStream.Buffer.Empty" && playbackState != "ENDED" ||
              code == "NetStream.SeekStart.Notify" ||
              code == "NetStream.Play.Start");
    }

    private function playerPlay():void {
      mediaPlayer.play();
    }

    private function playerPause():void {
      mediaPlayer.pause();
    }

    private function playerSeek(seconds:Number):void {
      mediaPlayer.seek(seconds);
    }

    private function playerStop():void {
      mediaPlayer.stop();
    }

    private function onTimeUpdated(event:TimeEvent):void {
      _triggerEvent('progress');
      _triggerEvent('timeupdate');
    }

    private function getPosition():Number {
      return mediaPlayer.currentTime;
    }

    private function getDuration():Number {
      return mediaPlayer.duration;
    }

    private function _triggerEvent(name: String):void {
      ExternalInterface.call('Clappr.Mediator.trigger("' + playbackId + ':' + name +'")');
    }

    private function getState():String {
      return playbackState;
    }
  }
}
