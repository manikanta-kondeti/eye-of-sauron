'use strict'
var React = require('react');
var Radium = require('radium');
var LoadingSpinner = require('./../components/LoadingSpinner');
var ShowClips = require('./ShowClips');
var {StyleRoot} = Radium;
var Page = require('page');

var ChannelPage = React.createClass({
	getInitialState : function() {
		return {channel : null, expressions : [], cursor : null, more : false, get_channel_content : false, loading : false};
	},

	componentDidMount : function() {
		window.addEventListener('scroll', this.handleScroll);
		//Get channel 
		this.getChannelContent();
	},
	
	componentDidUpdate: function() {
		var showCLipsHeight = document.getElementById('show-clips').clientHeight;
    	var windowInnerHeight = window.innerHeight;
    	if(showCLipsHeight < windowInnerHeight) {
    		if (!this.state.get_channel_content_called && this.state.more && this.state.cursor != null) {
    			this.getChannelContent();
    		}
    	}
	},

	getChannelContent : function() {
		var _this = this;
		this.setState({get_channel_content_called : true});
		var languages = [];
		if (sessionStorage.user_languages_without_login != undefined) {
			languages = sessionStorage.user_languages_without_login.split(',');
			languages.push('global');
		}
		gapi.client.samosa.api.get_expressions_in_channel({'channel_id' : this.props.params.key, 'cursor' : this.state.cursor, 'languages' : languages}).execute(
      	function(resp) {
      			if (resp.voices == undefined) {
      				Page('/errorPage');
      			}
      			_this.setState({
      							expressions : _this.state.expressions.concat(resp.voices), 
      							channel : resp.channel,
      						 	cursor : resp.cursor, 
      						 	more : resp.more, 
      						 	get_channel_content_called : false
      			});
        });
	},

	handleScroll: function() {
		  // you're at the bottom of the page
		  if ((window.innerHeight + window.scrollY+3) >= this.getDocHeight()) {
     		if (!this.state.get_channel_content_called && this.state.more == true && this.state.cursor != null) {
     			this.getChannelContent();
     		}
   		 }
	},

	getDocHeight: function() {
   		var D = document;
   	 	return Math.max(
    	    Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        	Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
       		Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    	);	
	},

	render : function() {

		var styles = {
			channelDiv : {
				width : '100%',
				position: 'relative',
				height : '200px',
				marginTop : '2.8%',
				fontFamily : '"Helvetica Neue",Helvetica,Arial,sans-serif',
				background: '#4b616e',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				width: '100%',
    				height: '375px',
    				marginTop : '0px'
  				}
  			},

  			imageStyle : {
				borderRadius: '100px',
	    		width: '150px',
	    		height: '150px',
	   			'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				width: '225px',
    				height: '225px',
    				borderRadius: '150px',
  				},
	    		boxShadow : '0 0 0 4px #fff'
			},

			imageDivStyle : {
				float: 'left',
				marginLeft: '37%',
	    		padding: '18px',
	    		marginTop : '5px',
	   			'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				padding: '50px',
    				marginLeft: '25%',
  				   	marginTop : '40px'
  				},
			},

			channelDetailsDivStyle : {
				float : 'right',
				margin: '13px',
				padding: '10px',
				color: 'white'
			},

			channelDetailsStyle : {
				fontSize: '18px',
				fontWeight: '500',
				fontFamily: 'sans-serif',
				color: 'white',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				fontSize: '30px'
  				}
			},

			channelMetricStyle : {
	    		fontSize: '14px',
	    		fontWeight: '300',
	    		letterSpacing: '.015em',
	    		lineHeight: '24px',
	    		color: 'white',
	    		'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				fontSize: '20px'
  				}
			},

			channelDescriptionStyle : {
			    fontSize: '14px',
			    opacity: '0.65',
			    lineHeight: '1.5em',
			    maxHeight: '6em',
			    marginTop: '10px',
			    overflow: 'hidden',
			    '@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				display : 'none'
  				}	
			},

			contentDiv : {
				marginTop: '20px',
				marginLeft : '50px',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				
  				}
			},

			loadingStyle : {
				display : 'none'
			}
		}

		var subscribers = null, poster = null, channel_name = null, tags = null;
		if (this.state.channel) {
			poster = this.state.channel.poster_url || this.state.thumbnail_url || "https://console.developers.google.com/m/cloudstorage/b/samosa_app_files/o/static_images/channelPlaceholder.png";
			channel_name = this.state.channel.name;
			subscribers = this.state.channel.num_subscribers;
			if (this.state.channel.tags != undefined) {
				tags = "Tags:" + this.state.channel.tags;
			}
		}

	    // Adding a loading toast 
	    var loadingSpinner = null;
        if (this.state.get_channel_content_called){
            styles.loadingStyle['display'] = 'block';
        }
		return (
			<StyleRoot>
				<div>
					<div style={styles.loadingStyle}>
						<LoadingSpinner />
					</div> 
					<div style={styles.channelDiv}>
						<div style={styles.channelContentDiv}>
							<div style={styles.imageDivStyle}>
								<img style={styles.imageStyle} src={poster} />
								<div style={styles.channelDetailsDivStyle}>
									<div style={styles.channelDetailsStyle}>
										{channel_name}
									</div>
									<div style={styles.channelMetricStyle}>
									    Subscribers: {subscribers}
									</div>
									<div style={styles.channelDescriptionStyle}>
										{tags}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div style={styles.contentDiv}> 
						<ShowClips clips = {this.state.expressions} />
					</div>
				</div>
			</StyleRoot>
		)
	} 
});

class ChannelPageWithMediaQuery extends React.Component{
	render() {
		return(
			<StyleRoot>
				<ChannelPage params={this.props.params} />
			</StyleRoot>
		)
	}
}

module.exports = Radium(ChannelPageWithMediaQuery);