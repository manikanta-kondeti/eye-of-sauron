/** 
 * @jsx React.DOM 
 **/

var React = require('react');

CircularProgressBarGraphic = React.createClass({
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

      return <CircularProgressBarGraphic width={this.props.width} height={this.props.height} style={this.props.style} percent={this.props.percent} lineWidth={this.props.lineWidth} />
    } 
    return <div style={this.props.style} />;
  }
});


var PlayerStates = {
  STOPPED: 0,
  LOADING: 1, 
  PLAYING: 2,
  PAUSED: 3,
  ENDED: 4
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
    if (this.state.currentState == PlayerStates.STOPPED || this.state.currentState == PlayerStates.ENDED) {

        console.log('listen');

         Parse.Analytics.track('Listens', {
            device: 'Iframe'
        });

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
    console.log('hi');
    this.setState({currentState: PlayerStates.ENDED , currentTime: 0});
  },
  componentDidMount: function() {
    if (this.props.autoPlay) {
      this.onClick();
    }
  },

  handleDownloadIconClick: function(download_redirect){

        console.log('hi')

       Parse.Analytics.track('DownloadIconClick', {
            device: 'Iframe',
            download_redirect: download_redirect
        });
  },

  render: function() {
    var control = <img width='35' src="/static/images/play.png" />;
    if (this.state.currentState == PlayerStates.LOADING) {
      // use time update event to show this; show spinner until this point
      control = <img width='35' src="/static/images/spinner.gif" />;
    } else if (this.state.currentState == PlayerStates.PLAYING) {

      control = <img width='35' src="/static/images/pause.png" />;
    }

    //TODO(abhilashi): fix all these magic numbers
    var padding = 10;
    var audioPlayerControlsStyle = {
      position: 'absolute',
      left: '43%',
      top: '40%',
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
    
    var download_icon_width = this.props.frameWidth/6;

    var download_icon_padding = download_icon_width/4;


    var downloadIconsWrapper={
      display: 'none',
      width: '100%',
      position: 'absolute',
      background: 'rgba(0, 0, 0, 0.7)',
      bottom: '0px',
      padding: '5px'
    }

    var downloadIconStyle = {
      width: '20%',
      marginLeft: '5%'   
    }

    if (this.state.currentState == PlayerStates.ENDED) {
      downloadIconsWrapper['display'] = 'block';
    }

    return (
    <div>
      <div style={audioPlayerControlsStyle} onClick={this.onClick} >
        {control}
        <CircularProgressBar 
          style={canvasStyle}
          width={36}
          height={36}
          lineWidth={4}
          percent={Math.min(Math.max(0, this.state.currentTime / this.state.duration || 0), 1)} />
      </div>

      <div style={downloadIconsWrapper}>
              <div style={{color: 'white', marginBottom: '12px', marginLeft: '10px', fontSize: '14px'}}> To share this clip on Whatsapp</div>
              <a onClick = {this.handleDownloadIconClick.bind(this,'android')} target='_top' href="https://play.google.com/store/apps/details?id=com.getsamosa">
                <img style={downloadIconStyle} src="https://www.gstatic.com/android/market_images/web/play_logo_x2.png" />
              </a>
              <a onClick = {this.handleDownloadIconClick.bind(this,'apple')}  target='_top' href ="https://itunes.apple.com/in/app/samosa-chat/id973054666?mt=8">
                <img style={downloadIconStyle} src="http://www.yallatruck.com/wp-content/uploads/2014/08/apple-app-store-icon.jpg" />
              </a>
              <a onClick = {this.handleDownloadIconClick.bind(this,'windows')} target='_top' href ="https://www.microsoft.com/en-us/store/apps/samosa-chat/9nblggh0lcd0"> 
                <img style={downloadIconStyle} src="https://i-msdn.sec.s-msft.com/dynimg/IC795460.png" />
              </a>  
              <a onClick = {this.handleDownloadIconClick.bind(this,'chrome-plugin')} target='_top' href ="https://chrome.google.com/webstore/detail/samosa/acghjnlbnackkloofkiebcicedbfipbg?hl=en">
                <img style={downloadIconStyle} src="https://www.mailvelope.com/img/ChromeWebStore_Badge_v2_340x96.png" />
              </a>
      </div> 
    </div>
    );
  }
});

module.exports = AudioPlayer;
