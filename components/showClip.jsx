
'use strict'
var React = require('react');
var Page = require('page');
var RedButton = require('../components/RedButton')
var AudioPlayer = require('../components/AudioPlayer');


module.exports = React.createClass({


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

		var audioBlockStyle = {
			height: '218px',
			boxShadow: '0 2px 1px rgba(0, 0, 0, 0.3)',
			position: 'relative',
			minHeight: '1px',
			borderRadius: '2px',
			width: '150px',
			float: 'left',
			margin: '8px',
			cursor: 'pointer',
			background: 'white'
		}

		var imgStyle = {
			position: 'relative',
			overflow: 'hidden',
			backgroundImage: 'url('+ poster_url +')',
			backgroundRepeat: 'no-repeat',
			backgroundSize: '150px 150px',
			height: '150px'
		}

		var titleStyle = {
			whiteSpace: 'nowrap',
			overflow: 'hidden',		
			fontSize: '13px',
			marginTop: '9px',
			marginBottom: '7px',
			marginRight: '7px',
			marginLeft: '6px',
			textAlign: 'center'
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
			display: 'none',
			height: '32px'
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

		return (
		
				<div onMouseLeave={this.MouseEvent} onMouseEnter={this.MouseEvent}  style={audioBlockStyle}>
                    <div>
                        <div>
                            <div style={imgStyle}>
								<div style={overlayStyle}>

								    <AudioPlayer
							        	opusURL={this.props.data.opus_url}
           							    mp3URL={this.props.data.mp3_url}
             						    frameWidth={150}
              							frameHeight={150}
              						 	controlSize={10}
              						 	fontSize={9} />
								</div>
                            </div>
                            <div>
			    				<p onClick={this.navigate.bind(this,'/play/'+this.props.data.key)} style={titleStyle} > {this.props.data.transcript} </p>
                    	        <hr style={hrStyle}/>
                            </div>

                            <div onClick = { this.handleCopyClick.bind(this,this.props.data.key) } style={buttonStyle}>
                         	  	<RedButton text = "SHARE" /> 
                         	</div>

							<div style={socialIconsStyle}> 
								<div style={heartsStyle}>
									<img style={iconStyle} src="/static/images/heart.png" />
									<span style={iconFontStyle}> {this.props.data.hearts} </span>
								</div>
								<div style={sharesStyle}>
									<img style={iconStyle}  src="/static/images/share.png" />
									<span style={iconFontStyle}> {this.props.data.shares} </span>
								</div>
							</div>

		     	    	</div>
                	</div>
				</div>
		)
	}

});