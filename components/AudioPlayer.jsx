/** 
 * @jsx React.DOM 
 **/

var React = require('react');

var CircularProgressBarGraphic = React.createClass({
  componentDidMount: function() {
    var context = this.getDOMNode().getContext('2d');
    context.width = this.props.width;
    context.height = this.props.height;
    context.translate(context.width / 2, context.height / 2);
    context.rotate(-1 * Math.PI / 2);
    this.paint(context);
  },
  componentDidUpdate: function() {
    var canvas = this.getDOMNode();
    var context = canvas.getContext('2d');
    context.clearRect (0 ,0 ,canvas.width, canvas.height );
    this.paint(context);
  },
  paint: function(context) {
    var radius = (this.props.width - this.props.lineWidth) / 2;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2 * this.props.percent, false);
    context.strokeStyle = '#ff0000';
    context.lineCap = 'round'; // butt, round or square
    context.lineWidth = this.props.lineWidth; 
    context.stroke();
  },
  render: function() {
    return (
      <canvas 
        width={this.props.width} 
        height={this.props.height} 
        style={this.props.style} 
      />
    );
  }
});

var CircularProgressBar = React.createClass({

  render: function() {
    if (this.props.percent) {

      return <CircularProgressBarGraphic {...this.props} />
    } 
    return <div style={this.props.style} />;
  }
});


var PlayerStates = {
  STOPPED: 0,
  LOADING: 1, 
  PLAYING: 2,
  PAUSED: 3,
};

var Sound = typeof Audio !== 'undefined' ? new Audio() : null;

var AudioPlayer = React.createClass({
  getInitialState: function() {
    return {
      currentState: PlayerStates.STOPPED, 
      currentTime: 0, 
      duration: 0
    };
  },
  onClick: function() {
    if (this.state.currentState == PlayerStates.STOPPED) {
      if (!!Sound.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '')) {
        Sound.src = this.props.opusURL;
      } else if (!!Sound.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
        Sound.src = this.props.mp3URL;
      }
      Sound.play();
      Sound.onended = this.onEnded;
      Sound.ontimeupdate = this.onTimeUpdate;
      this.setState({currentState:  PlayerStates.LOADING});
    } else if (this.state.currentState == PlayerStates.PLAYING) {
      Sound.pause();
      this.setState({currentState:  PlayerStates.PAUSED});
    } else if (this.state.currentState == PlayerStates.PAUSED) {
      Sound.play();
      this.setState({currentState:  PlayerStates.PLAYING});
    }
  },
  onTimeUpdate: function(e) {
    if (this.state.currentState !== PlayerStates.PAUSED) {
      this.setState({
        duration: Sound.duration,
        currentState: PlayerStates.PLAYING, 
        currentTime: Sound.currentTime
      });
    }
  },
  onEnded: function() {
    this.setState({currentState: PlayerStates.STOPPED , currentTime: 0});
  },
  componentDidMount: function() {
    if (this.props.autoPlay) {
      this.onClick();
    }
  },
  render: function() {
    var control = <img width='35' src="../public/images/play.png" />;
    if (this.state.currentState == PlayerStates.LOADING) {
      // use time update event to show this; show spinner until this point
      control = <img width='35' src="../public/images/spinner.gif" />;
    } else if (this.state.currentState == PlayerStates.PLAYING) {
      control = <img width='35' src="../public/images/pause.png" />;
    }

    //TODO(abhilashi): fix all these magic numbers
    var padding = 6;
    var audioPlayerControlsStyle = {
      position: 'absolute',
      left: this.props.frameWidth / 2 - this.props.controlSize / 2 - padding,
      top: this.props.frameHeight / 2 - this.props.controlSize / 2 - padding,
      background: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '8px',
      padding: padding,
      cursor: 'pointer',
    };
    var canvasStyle = {
      position: 'absolute',
      top: padding,
      left: padding,
    };
    
    return (
      <div style={audioPlayerControlsStyle} onClick={this.onClick} >
        {control}
        <CircularProgressBar 
          style={canvasStyle}
          width={64}
          height={64}
          lineWidth={4}
          percent={Math.min(Math.max(0, this.state.currentTime / this.state.duration || 0), 1)} />
      </div>
    );
  }
});

module.exports = AudioPlayer;
