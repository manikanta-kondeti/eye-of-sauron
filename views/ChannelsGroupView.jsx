'use strict'

var React = require('react');
var Page = require('page');
var ShowClips = require('./ShowClips');
var LoadingSpinner = require('./../components/LoadingSpinner');
var ShowChannels = require('./../views/ShowChannels');

var ChannelGroups = {
	'latest_movies' : '1',
	'greetings' : '3',
	'actors' : '5',
	'trending_channels' : '7',
	'movies' : '6',
	'politics' : '4'
};

module.exports = React.createClass({
	/**
	 * Note: While handling scroll in safari becareful with sroll event. It will be called lot of times unlike chrome and firefox
	 * Hence we used a flag 'get_channels_by_type_called' which prevents multiple get_channels_by_type calls. 
	 */
	getInitialState: function() {	
		return {channels: [], cursor: '', more : false, auth_key:'', get_channels_by_type_called: false, channel_group_type : null}
	},

	componentDidMount: function() {
		this.get_channels_by_type(window.location.pathname.slice(1));
    	window.addEventListener('scroll', this.handleScroll);
	},

	componentDidUpdate: function() {
		var showCLipsHeight = document.getElementById('show-clips').clientHeight;
    	var windowInnerHeight = window.innerHeight;
    	if(showCLipsHeight < windowInnerHeight) {
    		if (!this.state.get_channels_by_type_called && this.state.cursor && this.state.more) {
    			this.get_channels_by_type();
    		}
    	}
	},

	get_channels_by_type : function(channel_type) {
		var _this = this;
		this.setState({get_channels_by_type_called: true});
		var args = {'cursor': this.state.cursor, 'auth_key': sessionStorage.getItem('samosa_key'), channel_group_type : ChannelGroups[channel_type]};
		var languages = [];
		// if condition to check if user is logged in and send set languages if not a logged in user
		if (sessionStorage.user_languages_without_login != undefined && sessionStorage.user_languages_without_login != '' && (sessionStorage.samosa_key == undefined || sessionStorage.samosa_key == "")) {
			languages = sessionStorage.user_languages_without_login.split(',');
			languages.push('global');
			args['languages'] = languages;
		}
	  	gapi.client.samosa.api.get_channels_by_type(args).execute(
      		function(resp) {
      			if (resp.channels == undefined) {
      				_this.setState({channels: [], cursor: '', more : false, auth_key:'', get_channels_by_type_called: false, channel_group_type : null})
      				Page('/errorPage');
      			}
      			var new_channels = _this.state.channels.concat(resp.channels);
      			_this.setState({channels: new_channels, cursor: resp.cursor, get_channels_by_type_called: false, channel_group_type : channel_type});
            });
	},

	handleScroll: function() {
		  // you're at the bottom of the page
		  if ((window.innerHeight + window.scrollY+3) >= this.getDocHeight()) {
     		if (!this.state.get_channels_by_type_called && this.state.cursor && this.state.more) {
     			this.get_channels_by_type();
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

	navigate: function(url) {
		if (url == "/popular-now" || url == "/most-recent") {
			Page(url);
			return;
		}
		
		window.location = url;
	},

	render: function() {

		var container = {
			width: '100%',
			top: '0px',
			left: '0px'
		}

	    var rightSideWrapper  = {
	    	position: 'absolute',
	    	background: '#eff3fa',
	    	top: '360px',
	    	float: 'left',
			height: 'auto',
			width: '100%',
			zIndex:'1000',
			paddingLeft: '2%'
		}

		var leftSideWrapper = {
			position: 'absolute',
			top: '360px',
			right: '0px',
			float: 'left',
			width: '30%',
			background: 'white',
			zIndex: '1000',
			height: '100%'
		}

		var selectItemWrapper = {
			padding: '10px',
			width: '1000px',
			margin: '0 auto'
		}

		var selectItem = {
			padding: '10px',
			marginRight: '25px',
			cursor: 'pointer',
			textDecoration: 'none',
			color: 'black',
			fontFamily: "'Roboto', sans-serif"
		}
		
		var selectItemClicked = {
			padding: '10px',
			marginRight: '25px',
			cursor: 'pointer',
			textDecoration: 'none',
			color: 'black',
			borderBottom: '2px solid #50E3C2',
			fontFamily: "'Roboto', sans-serif"
		}

		var embedTitle = {
			textAlign: 'center',
			marginTop: '10px'
		}

		var content = {
			float : 'left',
			marginTop: '20px',
			width : '100%'
		}

		var iframeEmbed = {
			marginTop: '30px'
		}

		var embedButton = {
			background: 'url(/static/images/embed_button.png) no-repeat center center',
			height: '60px',
			cursor: 'pointer'
		}

		var moviesDiv = {
			float : 'right',
			marginTop: '20px',
			width : '100%'
		}

        // Adding a loading toast 
        var loadingToast = null;
        if (this.state.get_channels_by_type_called){
            loadingToast = <LoadingSpinner />
        }
        // Get pathname
        var group_type = window.location.pathname.slice();
        var latest_movies_style = selectItem;
        var actors_style = selectItem;
        var greetings_style = selectItem;
        var trending_channels_style = selectItem;
        var movies_style = selectItem;
        var politics_style = selectItem;

        if (this.state.channel_group_type == "actors") {
        	actors_style = selectItemClicked;
        }
        if (this.state.channel_group_type == "greetings") {
        	greetings_style = selectItemClicked;
        }
        if (this.state.channel_group_type == "trending_channels") {
        	trending_channels_style = selectItemClicked;
        }
        if (this.state.channel_group_type == "latest_movies") {
        	latest_movies_style = selectItemClicked;
        }
        if (this.state.channel_group_type == "movies") {
        	movies_style = selectItemClicked;
        }
        if (this.state.channel_group_type == "politics") {
        	politics_style = selectItemClicked;
        }

		return (
			<div style= {container}>	
				<div style = {rightSideWrapper}>
					<div className='hyperLinks'  style={selectItemWrapper}>
						<a onClick={this.navigate.bind(this, '/popular-now')} style={selectItem} href = "">TRENDING</a>
						<a onClick={this.navigate.bind(this, '/most-recent')} style={selectItem} href = "">MOST RECENT</a>
						<a onClick={this.navigate.bind(this, '/latest_movies')} style={latest_movies_style} href = "">LATEST MOVIES</a>
						<a onClick={this.navigate.bind(this, '/actors')} style={actors_style} href = "">ACTORS</a>
						<a onClick={this.navigate.bind(this, '/greetings')} style={greetings_style} href = "">GREETINGS</a>
						<a onClick={this.navigate.bind(this, '/trending_channels')} style={trending_channels_style} href = "">TRENDING CHANNELS</a>
						<a onClick={this.navigate.bind(this, '/movies')} style={movies_style} href = "">MOVIES</a>
						<a onClick={this.navigate.bind(this, '/politics')} style={politics_style} href = "">POLITICS</a>
					</div>
					<div style={content}>
						<ShowChannels clips = {this.state.channels}/>
					</div>
					{loadingToast}
				</div>
			</div>
		)
	}
});
