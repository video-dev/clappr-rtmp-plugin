package
{
	import flash.display.Sprite;

	import org.osmf.containers.MediaContainer;
	import org.osmf.elements.VideoElement;
	import org.osmf.media.DefaultMediaFactory;
	import org.osmf.media.MediaElement;
	import org.osmf.media.MediaPlayer;
	import org.osmf.media.URLResource;

	[SWF( width="640", height="360" )]
	public class RTMP extends Sprite
	{
		public function RTMP()
		{
			// Store the URL
			var videoPath:String = "rtmp://cp67126.edgefcs.net/ondemand/mediapm/strobe/content/test/SpaceAloneHD_sounas_640_500_short";

			// Create a resource
			var resource:URLResource = new URLResource( videoPath );

			// Create a mediafactory instance
			var mediaFactory:DefaultMediaFactory = new DefaultMediaFactory();

			// Create a MediaElement
			//var element:VideoElement = new VideoElement( resource );
			var element:MediaElement = mediaFactory.createMediaElement( resource );

			// Create a media player
			var mediaPlayer:MediaPlayer = new MediaPlayer( element );

			// Create a media container & add the MediaElement
			var mediaContainer:MediaContainer = new MediaContainer();
			mediaContainer.addMediaElement( element );

			// Add the container to the display list
			addChild( mediaContainer );

		}
	}
}
