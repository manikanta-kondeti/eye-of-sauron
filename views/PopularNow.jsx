'use strict'

var React = require('react');
var Page = require('page');
var ShowClips = require('./ShowClips');
var LoadingSpinner = require('./../components/LoadingSpinner')

module.exports = React.createClass({
	/**
	 * Note: While handling scroll in safari becareful with sroll event. It will be called lot of times unlike chrome and firefox
	 * Hence we used a flag 'popular_now_called' which prevents multiple popular_now calls. 
	 */
	getInitialState: function() {	
		return {voices: [], cursor: '', auth_key:'', popular_now_called: false}
	},

	componentDidMount: function() {
		this.popular_now();
    	window.addEventListener('scroll', this.handleScroll);
	},

	componentDidUpdate: function() {
		var showCLipsHeight = document.getElementById('show-clips').clientHeight;
    	var windowInnerHeight = window.innerHeight;
    	if(showCLipsHeight < windowInnerHeight) {
    		if (!this.state.popular_now_called) {
    			this.popular_now();
    		}
    	}
	},

	popular_now: function() {
		var _this = this;
		this.setState({popular_now_called: true});
	  	var popularr_voices = gapi.client.samosa.api.expressions.popular({'cursor': this.state.cursor, 'auth_key': sessionStorage.getItem('samosa_key')}).execute(
      	function(resp) {
      			var new_voices = _this.state.voices.concat(resp.voices);
      			_this.setState({voices: new_voices, cursor: resp.cursor, popular_now_called: false});
            });
	},

	handleScroll: function() {
		  // you're at the bottom of the page
		  if ((window.innerHeight + window.scrollY+3) >= this.getDocHeight()) {
     		if (!this.state.popular_now_called) {
     			this.popular_now();
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
		Page(url);
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
			padding: '10px'
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
			marginTop: '20px'
		}

		var iframeEmbed = {
			marginTop: '30px'
		}

		var embedButton ={
			background: 'url(/static/images/embed_button.png) no-repeat center center',
			height: '60px',
			cursor: 'pointer'
		}
        // Adding a loading toast 
        var loadingSpinner = null;
        if (this.state.popular_now_called){
            loadingSpinner = <LoadingSpinner />
        }
		return (
			<div style= {container}>	
				<div style = {rightSideWrapper}>
					<div style={selectItemWrapper}>
						<a onClick={this.navigate.bind(this, '/popular-now')} style={selectItemClicked} href = "">TRENDING</a>
						<a onClick={this.navigate.bind(this, '/most-recent')} style={selectItem} href = "">MOST RECENT</a>
					</div>
					<div style={content}>
						<ShowClips clips = {this.state.voices} />
					</div>
					{loadingSpinner}
				</div>
			</div>
		)
	}
});