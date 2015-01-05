var Playback = require('playback');
var JST = require('./jst');

class Rtmp extends Playback {
  get name() { return 'rtmp'; }

  render() {
    console.log("rendering", this.name);
    var style = $('<style>').html(JST.CSS[this.name]);
    this.$el.append(style);
    return this;
  }

}

Rtmp.canPlay = function(source) {
  //should return true for the supported media source
  return false;
};


module.exports = window.Rtmp = Rtmp;
