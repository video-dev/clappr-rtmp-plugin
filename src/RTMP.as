package {
  import flash.display.Sprite;
  import flash.external.ExternalInterface;
  import flash.system.Security;

  import org.osmf.containers.MediaContainer;
  import org.osmf.elements.VideoElement;
  import org.osmf.media.DefaultMediaFactory;
  import org.osmf.media.MediaElement;
  import org.osmf.media.MediaPlayer;
  import org.osmf.media.URLResource;
  import org.osmf.events.TimeEvent;

  [SWF(width="640", height="360")]
  public class RTMP extends Sprite {
    private var playbackId:String;
    private var mediaFactory:DefaultMediaFactory;
    private var mediaContainer:MediaContainer;
    private var mediaPlayer:MediaPlayer;
    private var element:MediaElement;

    public function RTMP() {
      Security.allowDomain('*');
      Security.allowInsecureDomain('*');
      playbackId = this.root.loaderInfo.parameters.playbackId;
      mediaFactory = new DefaultMediaFactory();
      mediaContainer = new MediaContainer();

      setupCallbacks();
      ExternalInterface.call('console.log', 'clappr rtmp 0.2-alpha');
      _triggerEvent('flashready');
    }

    private function setupCallbacks():void {
      ExternalInterface.addCallback("playerLoad", playerLoad);
      ExternalInterface.addCallback("playerPlay", playerPlay);
      ExternalInterface.addCallback("playerPause", playerPause);
      ExternalInterface.addCallback("playerStop", playerStop);
      ExternalInterface.addCallback("playerSeek", playerSeek);
    }

    private function playerLoad(url:String):void {
      element = mediaFactory.createMediaElement(new URLResource(url));
      mediaPlayer = new MediaPlayer(element);
      mediaPlayer.autoPlay = false;
      mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeUpdated);
      mediaPlayer.addEventListener(TimeEvent.DURATION_CHANGE, onTimeUpdated);
      mediaContainer.addMediaElement(element);
      addChild(mediaContainer);
      ExternalInterface.call('console.log', 'source loaded!');
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
  }
}
