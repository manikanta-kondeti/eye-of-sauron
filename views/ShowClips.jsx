'use strict'

var React = require('react')
var RedButton = require('../components/RedButton')
var AudioPlayer = require('../components/AudioPlayer');

var Clip = React.createClass({


	getInitialState: function() {
		return {mouseEnter: false}
	},

	MouseEvent: function() {
		this.setState({mouseEnter: !this.state.mouseEnter})
	},


	render: function() {

		var poster_url = this.props.data.poster_url;

		var audioBlockStyle = {
			height: '320px',
			boxShadow: '0 2px 1px rgba(0, 0, 0, 0.3)',
			position: 'relative',
			minHeight: '1px',
			paddingRight: '15px',
			paddingLeft: '15px',
			width: '200px',
			paddingTop: '10px',
			float: 'left',
			margin: '10px',
			cursor: 'pointer'
		}

		var imgStyle = {
			backgroundImage: 'url('+ poster_url +')',
			backgroundRepeat: 'no-repeat',
			backgroundSize: '200px',
			width: '200px',
			height: '200px'
		}

		var titleStyle = {
			fontFamily: "'Ruda',sans-serif",
			marginTop: '10px',
			marginBottom: '16px'
		}

		var hrStyle = {
			border: '1px solid #cc181e'
		}

		var heartsStyle = {
			width: '80px',
			float: 'left',
			textAlign: 'center',
			marginTop: '14px',
		}

		var sharesStyle = {
			width: '80px',
			float: 'right',
			textAlign: 'center',
			marginTop: '14px',
		}

		var overlayStyle = {
	    	background: 'rgba(0, 0, 0, .75)',
	 	    textAlign: 'center',	  
	   	    width: '100%',
	   	    height: '100%', 
	  		transition: 'all 0.3s ease-in-out'
		}

		var socialIconsStyle = {

		}

		var buttonStyle = {
			display: 'none',
			marginTop:'25px'
		}

		var playActionStyle = {
			marginTop: '60px'
		}

		var iconStyle = {
			marginRight: '10px',
			float: 'left',
			width: '20px'
		}

		var iconFontStyle = {
			lineHeight: '20px',
			float: 'left',
			fontSize: '14px'
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
             						    frameWidth={256}
              							frameHeight={256}
              						 	controlSize={32} />
								</div>
                            </div>
                            <div>
			    				<p style={titleStyle} > {this.props.data.caption} </p>
                    	        <hr style={hrStyle}/>
                            </div>

                            <div style={buttonStyle}>
                         	  	<RedButton name = "COPY CLIP" /> 
                         	</div>

							<div style={socialIconsStyle}> 
								<div style={heartsStyle}>
									<img style={iconStyle} src="public/images/heart.png" />
									<span style={iconFontStyle}> {this.props.data.hearts} </span>
								</div>
								<div style={sharesStyle}>
									<img style={iconStyle}  src="https://d3pl14o4ufnhvd.cloudfront.net/v2/uploads/67b846c5-9b77-4a95-a2dd-d693142ec62c/248efd9e468170fdaec1a1025760c23f0fe3adaa_original.png" />
									<span style={iconFontStyle}> {this.props.data.shares} </span>
								</div>
							</div>

		     	    	</div>
                	</div>
				</div>
		)
	}

});

module.exports = React.createClass({

	render: function() {

		if(this.props.clips) {

			var clips = this.props.clips.map(function(data, index) {
			
				return <Clip data={data} key={index} />
			});
		}
		else{
			clips = "No clips Found"
		}

		return (

				<div>
					{clips}
 				</div>
		)
	}

});