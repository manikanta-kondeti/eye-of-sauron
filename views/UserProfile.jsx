'use strict'
var React = require('react');
var ShowClips = require('./ShowClips');
var ShowChannels = require('./ShowChannels');
var Radium = require('radium');
var {StyleRoot} = Radium;
var LoadingSpinner = require('./../components/LoadingSpinner');
var LoadMore = require('./../components/LoadMore');
var Page = require('page');

var CHANNEL_SECTIONS = {
	'user_owned_channels' : 0,
	'user_subscribed_channels' : 1
};

var UserProfile = React.createClass({
	getInitialState : function() {
		return {	
					voices : [], 
					own_channels : [], 
					subscribed_channels : [], 
					cursor_user_owned_channels : [], 
					cursor_user_subscribed_channels : [], 
					more_user_owned_channels : true,
					more_user_subscribed_channels : true, 
					user : null,
					loading : false,
					toggle_channel : CHANNEL_SECTIONS['user_owned_channels']
				};
	},

	componentDidMount : function() {
		this.setState({loading : true});
		this.getUserOwnedChannels();
		this.getUserSubscribedChannels();
		this.getUserProfile();
		this.setState({loading : false})
	},

	getUserProfile : function() {
		var _this = this;
		gapi.client.samosa.api.get_user_profile({'profile_key' : this.props.params.key}).execute(
			function(resp) {
				// User data returned
				_this.setState({user : resp});
			}
		);
	},

	toggleChannelSections : function(value) {
		if (this.state.toggle_channel != value) {
			this.setState({toggle_channel : value});
		} 
	},

	getUserOwnedChannels : function() {
		var _this = this;
	  	var get_own_channels = gapi.client.samosa.api.get_user_owned_channels({'data': this.props.params.key, 'cursor' : this.state.cursor_user_owned_channels}).execute(
      	function(resp) {
      			var new_own_channels = _this.state.own_channels.concat(resp.channels);
      			_this.setState({
      					own_channels: new_own_channels, 
      					cursor_user_owned_channels : resp.cursor, 
      					more_user_owned_channels: resp.more
      				});
        });
	},

	getUserSubscribedChannels : function() {
		var _this = this;
	  	var get_subscribed_channels = gapi.client.samosa.api.get_user_subscribed_channels({'data': this.props.params.key, 'cursor' : this.state.user_subscribed_channels}).execute(
      	function(resp) {
      			var new_subscribed_channels = _this.state.subscribed_channels.concat(resp.channels);
      			_this.setState({
      						subscribed_channels: new_subscribed_channels, 
      						cursor_user_subscribed_channels : resp.cursor, 
      						more_user_subscribed_channels : resp.more
      					});
        });
	},

	getMoreChannels : function() {
		// Get more user owned
		if (this.state.toggle_channel == CHANNEL_SECTIONS['user_owned_channels']) {
			if (this.state.more_user_owned_channels) {
				this.getUserOwnedChannels();
			}	
		} 
		else {
			if (this.state.more_user_subscribed_channels) {
				this.getUserSubscribedChannels();
			} 
		}
	},

	/**
	 * To navigate user when he clicks on a channel page
	**/
	navigate: function(url) {
		Page(url);
	},

	render: function() {

		var styles = {
			userProfileDiv : {
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

			userDetailsDivStyle : {
				float : 'right',
				margin: '13px',
				padding: '10px',
				color: 'white'
			},

			userDetailsStyle : {
				fontSize: '18px',
				fontWeight: '500',
				fontFamily: 'sans-serif',
				color: 'white',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				fontSize: '30px'
  				}
			},

			userMetricStyle : {
				fontSize: '14px',
	    		fontWeight: '300',
	    		letterSpacing: '.015em',
	    		lineHeight: '24px',
	    		color: 'white',
	    		'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				fontSize: '20px'
  				}
			},

			userDescriptionStyle : {
			    fontSize: '14px',
			    opacity: '0.65',
			    lineHeight: '1.5em',
			    maxHeight: '6em',
			    marginTop: '10px',
			    overflow: 'hidden',
			    '@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				fontSize: '20px'
  				}	
			},

			clipsStyle : {
				marginTop: 'auto',
				height: '100%',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				display: 'inline-table'
  				},
				background: 'linear-gradient(to bottom, rgba(115,139,150,1) 0%, rgba(96,125,139,1) 100%)'
			},

		 	userContentDiv : {
				margin: 'auto'
			},

			userSpecificChannelsStyle: {
				position: 'relative',
			    top: '0',
			    left: '0',
			    display: 'table',
			    width: '100%',
			    fontSize: '16px',
			    fontWeight: '300',
			    letterSpacing: '.015em',
			    lineHeight: '24px',
			    zIndex: '2',
			    cursor : 'pointer',
			  	'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
  				}
			},

			userOwnedChannelsStyle : {
				borderRight : '2px solid #f6f5f6',
				display: 'table-cell',
			    width: '50%',
			    height: '40px',
			    padding: '0 20px',
			    textAlign: 'right',
			    verticalAlign: 'middle',
			    color: '#4b616e',
			    fontWeight : '500',
			    fontSize : '15px',
			    backgroundColor : 'white',
			  	'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				fontSize: '30px',    
    				height: '100px',
    				padding: '0px 60px'
  				},
			},

			userSubscribedChannelsStyle : {
				borderLeft : '2px solid #f6f5f6',
				display: 'table-cell',
			    width: '50%',
			    height: '40px',
			    padding: '0 20px',
			    textAlign: 'left',
			    verticalAlign: 'middle',
			    color: '#4b616e',
			    fontWeight : '500',
			    fontSize : '15px',
			    backgroundColor: 'white',
			    '@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
    				fontSize: '30px',
    				height: '100px',
    				padding: '0px 60px'
  				},
			},

			loadMoreStyle : {
				marginLeft : '45%'
			}
		}

        // Adding a loading toast 
        var loadingToast = null;
        if (this.state.loading){
            loadingToast = <LoadingSpinner />
        }
        var user_name = null, full_name = null, score = null, poster = null;
        if (this.state.user) {
        	user_name = this.state.user.user_name;
        	score = this.state.user.score;
        	full_name = this.state.user.full_name;
        	poster = this.state.user.picture;
        	//TODO: if poster is null, get some user profile 
        	if (poster == null) {
        		poster = "https://console.developers.google.com/m/cloudstorage/b/samosa_app_files/o/static_images/profilePlaceholder.png";
        	}
        }	

		// load more based on 'more' parameter 
		var loadmore = null;
        // To highlight the section that is selected
        var channels_to_be_shown = null;
		if (this.state.toggle_channel == CHANNEL_SECTIONS['user_owned_channels']) {
			styles.userSubscribedChannelsStyle['backgroundColor'] = 'silver';
			channels_to_be_shown = this.state.own_channels;
			styles.userOwnedChannelsStyle['backgroundColor'] = 'white';
			styles.userOwnedChannelsStyle['textDecoration'] = 'underline';
			if (this.state.more_user_owned_channels) {
				loadmore = <LoadMore />;
			}
		}else if (this.state.toggle_channel == CHANNEL_SECTIONS['user_subscribed_channels']){
			channels_to_be_shown = this.state.subscribed_channels;
			styles.userSubscribedChannelsStyle['backgroundColor'] = 'white';
			styles.userSubscribedChannelsStyle['textDecoration'] = 'underline';
			styles.userOwnedChannelsStyle['backgroundColor'] = 'silver';
			if (this.state.more_user_subscribed_channels) {
				loadmore = <LoadMore />;
			}
		}

		return(
			<StyleRoot>
				<div>
					<div style={styles.userProfileDiv}>
						<div style={styles.userContentDiv}>
							<div style={styles.imageDivStyle}>
								<img style={styles.imageStyle} src={poster} />
								<div style={styles.userDetailsDivStyle}>
									<div style={styles.userDetailsStyle}>
										{full_name}
									</div>
									<div style={styles.userMetricStyle}>
										Share Score : {score}
									</div>
									<div style={styles.userDescriptionStyle}>
										@{user_name}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div style={styles.userSpecificChannelsStyle} className="UserSpecificChannels">
						<div style={styles.userOwnedChannelsStyle} onClick={this.toggleChannelSections.bind(this, 0)}>
							<span> UserOwnedChannels </span>
						</div>
						<div style={styles.userSubscribedChannelsStyle} onClick={this.toggleChannelSections.bind(this, 1)}>
							<span> UserSubscribedChannels </span>
						</div>
					</div>
					{loadingToast}
					<div>
						<ShowChannels clips = {channels_to_be_shown} />
						<div style={styles.loadMoreStyle} onClick={this.getMoreChannels}>
							{loadmore}
						</div>
					</div>

				</div>
			</StyleRoot>
		)	
	}
});


class UserProfileWithMediaQuery extends React.Component {
  render() {
    return (
      <StyleRoot>
        <UserProfile params={this.props.params}/>
      </StyleRoot>
    );
  }
}

module.exports = Radium(UserProfileWithMediaQuery);