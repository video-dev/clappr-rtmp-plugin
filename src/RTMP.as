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

  [SWF(width="640", height="360")]
  public class RTMP extends Sprite {
    private var playbackId:String;
    private var mediaFactory:DefaultMediaFactory;
    private var mediaContainer:MediaContainer;

    public function RTMP() {
      Security.allowDomain('*');
      Security.allowInsecureDomain('*');
      playbackId = this.root.loaderInfo.parameters.playbackId;
      mediaFactory = new DefaultMediaFactory();
      mediaContainer = new MediaContainer();

      setupCallbacks();
      _triggerEvent('flashready');
      ExternalInterface.call('console.log', 'clappr rtmp 0.0-alpha');
    }

    private function setupCallbacks():void {
      ExternalInterface.addCallback("playerPlay", play);
    }

    private function play(url:String):void {
      ExternalInterface.call('console.log', 'playing ' + url);
      var resource:URLResource = new URLResource(url);
      var element:MediaElement = mediaFactory.createMediaElement(resource);
      var mediaPlayer:MediaPlayer = new MediaPlayer(element);
      mediaContainer.addMediaElement(element);
      addChild(mediaContainer);
    }

    private function _triggerEvent(name: String):void {
      ExternalInterface.call('Clappr.Mediator.trigger("' + playbackId + ':' + name +'")');
    }
  }
}
