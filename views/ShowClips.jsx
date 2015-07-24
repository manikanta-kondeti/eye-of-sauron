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
<<<<<<< HEAD
			height: '218px',
			boxShadow: '0 2px 1px rgba(0, 0, 0, 0.3)',
			position: 'relative',
			minHeight: '1px',
			borderRadius: '2px',
			width: '150px',
			float: 'left',
			margin: '8px',
=======
			height: '230px',
			boxShadow: '0 2px 1px rgba(0, 0, 0, 0.3)',
			position: 'relative',
			minHeight: '1px',
			paddingRight: '6px',
			paddingLeft: '6px',
			width: '150px',
			paddingTop: '6px',
			float: 'left',
			margin: '10px',
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
			cursor: 'pointer',
			background: 'white'
		}

		var imgStyle = {
			backgroundImage: 'url('+ poster_url +')',
			backgroundRepeat: 'no-repeat',
			backgroundSize: '150px 150px',
			height: '150px'
		}

		var titleStyle = {
			whiteSpace: 'nowrap',
			overflow: 'hidden',		
<<<<<<< HEAD
			fontSize: '13px',
			marginTop: '9px',
			marginBottom: '7px',
			marginRight: '7px',
			marginLeft: '6px',
			textAlign: 'center'
=======
			fontSize: '14px',
			marginTop: '9px',
			marginBottom: '7px'
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
		}

		var hrStyle = {
			border: '1px solid #f5f5f1',
			margin: '0px'
		}

		var heartsStyle = {
			width: '55px',
			float: 'left',
			textAlign: 'center',
<<<<<<< HEAD
			marginLeft: '10px'
=======
			marginTop: '5px',
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
		}

		var sharesStyle = {
			width: '55px',
			float: 'right',
<<<<<<< HEAD
			textAlign: 'center'
=======
			textAlign: 'center',
			marginTop: '5px',
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
		}

		var overlayStyle = {
	    	background: 'rgba(0, 0, 0, .75)',
	 	    textAlign: 'center',	  
	   	    width: '100%',
	   	    height: '100%', 
	  		transition: 'all 0.3s ease-in-out'
		}

		var socialIconsStyle = {
			marginTop: '9px'
		}

		var buttonStyle = {
<<<<<<< HEAD
			display: 'none',
			height: '32px'
=======
			display: 'none'
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
		}

		var playActionStyle = {
			marginTop: '60px'
		}

		var iconStyle = {
			marginRight: '4px',
			float: 'left',
			width: '12px'
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
             						    frameWidth={151}
              							frameHeight={151}
              						 	controlSize={23} />
								</div>
                            </div>
                            <div>
			    				<p style={titleStyle} > {this.props.data.caption} </p>
                    	        <hr style={hrStyle}/>
                            </div>

                            <div style={buttonStyle}>
                         	  	<RedButton text = "COPY CLIP" /> 
                         	</div>

							<div style={socialIconsStyle}> 
								<div style={heartsStyle}>
									<img style={iconStyle} src="http://localhost:8080/public/images/heart.png" />
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
		

		return (

				<div>
					{clips}
 				</div>
		)
	}

});