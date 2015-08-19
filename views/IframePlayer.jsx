/** 
 * @jsx React.DOM 
 **/

'use strict'

var React = require('react');
var AudioPlayer = require('../components/AudioPlayer');

var StoryImage = React.createClass({
  render: function() {
    return (
      <img width="100%" height="100%" src={this.props.src} />
    );
  }
});

var PoweredByMessage = React.createClass({

  handleLogoOnClick: function() {

     Parse.Analytics.track('LogoClick', {
            device: 'Iframe'
        });
  },

  render: function() {
    var style = {
      position: 'fixed',
      top: '0px',
      left: '0px',
      background: 'rgba(0, 0, 0, 0.4)',
      padding: '4px',
    };
    return ( 
        <div style={style}>
          
          <a onClick={this.handleLogoOnClick} href="http://getsamosa.com" target="_blank">
       
          <img style={{float: 'left', marginRight: '4px'}} width="24px" height="24px" src="https://lh5.ggpht.com/oJpCSXfyxWeLDSM8GKN-SHyv8ZK29pF2NURecNkK1aQD_9mH0ZYscux07oNPgxog28RU=w300" />
       
          <div style={{float: 'left', color: 'white', marginTop: '4px',whiteSpace: 'nowrap'}}>
            Powered by Samosa!
          </div>
          </a>
        </div>
    );
  }
});

module.exports = React.createClass({

    getInitialState: function() {

      Parse.Analytics.track('IframeEmbeds', {
            device: 'Iframe'
      });

        document.getElementById('left-side-bar').style.display = 'None';
      
        document.getElementById('header').style.display = 'None';
        return({voice: []})
    },

    componentDidMount: function(){
        this.search_by_key();
    },

    search_by_key: function() {
       var _this = this;
      
       //Here response is a single voice object
       gapi.client.samosa.api.get_expression_by_key({'id': this.props.params.key}).execute(
            function(resp){
                    _this.setState({voice: resp});
                });
    },



   render: function() {



      var poster_url = this.state.voice.poster_url;
      
      var imgStyle = {
            position: 'absolute',
            top: '0px',
            bottom: '0px',
            display: 'block',
            width: '100%',
            backgroundImage: 'url('+ poster_url +')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
      }


    var frameWidth = 512;
    var frameHeight = 512;
    if (typeof window !== 'undefined') {
      frameWidth = window.innerWidth;
      frameHeight = window.innerHeight;
    }

    console.log(frameHeight);
    console.log(frameWidth);

    return (
      <div>
        <div style={imgStyle}>
          <AudioPlayer
            frameWidth={frameWidth}
            frameHeight={frameHeight}
            controlSize={64}
            opusURL={this.state.voice.opus_url}
            mp3URL={this.state.voice.mp3URL} />
           <PoweredByMessage />
        </div>
      </div>
    );
  }
});

