
'use strict'
var React = require('react');
var Page = require('page');
var RedButton = require('../components/RedButton');
var ChannelSubscribeButton = require('../components/ChannelSubscribeButton')
var AudioPlayer = require('../components/AudioPlayer');
var Radium = require('radium');
var {StyleRoot} = Radium;

var ShowChannel = React.createClass({


	getInitialState: function() {
		return {mouseEnter: false}
	},

	MouseEvent: function() {
		this.setState({mouseEnter: !this.state.mouseEnter})
	},
 
 	handleCopyClick: function(storyId) {
 	  	   window.prompt(
    	  "Copy to clipboard: Ctrl+C, Enter", 
     		 "http://getsamosa.com/play/" + storyId
    	);
  	},

  	navigate: function(url) {
		Page(url);
	},

	render: function() {
		var poster_url = this.props.data.poster_url;
		if (poster_url == undefined) {
			poster_url = this.props.data.thumbnail_url || "https://console.developers.google.com/m/cloudstorage/b/samosa_app_files/o/static_images/channelPlaceholder.png"; 

		}

		var audioBlockStyle = {
			height: '260px',
			position: 'relative',
			minHeight: '1px',
			borderRadius: '2px',
			width: '180px',
			float: 'left',
			margin: '12px',
			padding : '10px',
			cursor: 'pointer',
			'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {    
    				height: '342px',
    				width : '260px'
  			},
		}

		var imgStyle = {
			position: 'relative',
			overflow: 'hidden',
			backgroundImage: 'url('+ poster_url +')',
			backgroundRepeat: 'no-repeat',
			backgroundSize: '180px 180px',
			height: '180px',
			borderRadius : '100px',
			'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
				height: '260px',
				backgroundSize: '260px 260px',
				borderRadius : '150px'
  			}
		}

		var titleStyle = {
			whiteSpace: 'nowrap',
			overflow: 'hidden',		
			fontSize: '13px',
			marginTop: '9px',
			marginBottom: '7px',
			marginRight: '7px',
			marginLeft: '6px',
			textAlign: 'center',
		}

		var hrStyle = {
			border: '1px solid #f5f5f1',
			margin: '0px'
		}

		var heartsStyle = {
			width: '70px',
			float: 'left',
			textAlign: 'center',
			marginLeft: '10px'
		}

		var sharesStyle = {
			width: '70px',
			float: 'right',
			textAlign: 'center'
		}

		var overlayStyle = {
	    	background: 'rgba(0, 0, 0, .2)',
	 	    textAlign: 'center',	  
	   	    width: '100%',
	   	    height: '100%', 
	  		transition: 'all 0.3s ease-in-out'
		}

		var socialIconsStyle = {
			marginTop: '9px'
		}

		var buttonStyle = {
			display: 'block',
			height: '30px',
    		width: '100px',
    		margin: '0 auto'
		}

		var iconStyle = {
			marginRight: '4px',
			float: 'left',
			width: '20px'
		}

		var iconFontStyle = {
			lineHeight: '12px',
			float: 'left',
			fontSize: '10px'
		}

		var ChannelTitleStyle = {
			fontSize : '14px',
			textAlign : 'center',
			fontFamily : 'sans-serif',
			fontWeight : '500',
			color : 'slategray',
			'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
				fontSize : '25px'
			}
		}
		/*
		if(this.state.mouseEnter){
			overlayStyle['opacity'] = 1;
			buttonStyle['display'] = 'block';
			socialIconsStyle['display'] = 'none';
		}
		else{
			overlayStyle['opacity'] = 0;
			buttonStyle['display'] = 'none';
			socialIconsStyle['display'] = 'block';
		}
		*/
		var name = null;
		 if (this.props.data.name) {
		 	name = this.props.data.name.toUpperCase();
		 }
		return (
			<StyleRoot>
				<div onMouseLeave={this.MouseEvent} onMouseEnter={this.MouseEvent}  style={audioBlockStyle} onClick={this.navigate.bind(this,'/channel/'+this.props.data.key)}>
                    <div>
                        <div style={imgStyle}>
							<div style={overlayStyle}>
							</div>
                        </div>
                	        
                        <div style={ChannelTitleStyle}>
                        	{name}
                        	<hr style={hrStyle}/>
                        </div>

                        <div style={buttonStyle}>
                     	  	 <ChannelSubscribeButton text = "SUBSCRIBE" />
                     	</div>
                	</div>
				</div>
			</StyleRoot>
		)
	}
});


class ShowChannelWithMediaQuery extends React.Component {
  render() {
    return (
      <StyleRoot>
        <ShowChannel data={this.props.data}/>
      </StyleRoot>
    );
  }
}


module.exports = Radium(ShowChannelWithMediaQuery);