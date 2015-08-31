'use strict'

var React = require('react');
var Page = require('page');
var ShowClips = require('./ShowClips');

module.exports = React.createClass({

	getInitialState: function() {
		return {
			voices: [],
			cursor: ''
		}
	},

	componentDidMount: function() {
		this.most_recent();
		window.addEventListener('scroll', this.handleScroll);
	},

	componentDidUpdate: function() {
		var showCLipsHeight = document.getElementById('show-clips').clientHeight;
    	var windowInnerHeight = window.innerHeight
    	if(showCLipsHeight < windowInnerHeight) {
    			console.log('update');
    		this.most_recent();
    	}
	},

	most_recent: function() {
	var _this = this;
	  var most_recent = gapi.client.samosa.api.expressions.recent({'cursor': this.state.cursor, 'auth_key': sessionStorage.getItem('samosa_key')}).execute(
      function(resp) {
      			var new_voices = _this.state.voices.concat(resp.voices);
      			_this.setState({voices: new_voices, cursor: resp.cursor});

            });
	},

	
	handleScroll: function() {

		  // you're at the bottom of the page
		  if ((window.innerHeight + window.scrollY+3) >= this.getDocHeight()) {
     		 this.most_recent();
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
			left: '0px',
		}

	    var rightSideWrapper  = {
	    	float: 'left',
			height: 'auto',
			width: '68%',
			paddingLeft: '2%'
		}

		var leftSideWrapper = {
			position: 'relative',
			float: 'left',
			width: '30%',
			background: 'white',
			height: '500px'
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
			width: '300px',
			height: '360px',
			position: 'absolute',
			left: '50%',
			marginLeft: '-150px',
			marginTop: '30px'
		}

		var embedButton ={
			
		}

		return (
			<div style= {container}>	
				<div style = {rightSideWrapper}>
					<div style={selectItemWrapper}>
						<a onClick={this.navigate.bind(this, '/popular-now')} style={selectItem} href = "">TRENDING</a>
						<a onClick={this.navigate.bind(this, '/most-recent')} style={selectItemClicked} href = "">MOST RECENT</a>
					</div>
					<div style={content}>
						<ShowClips clips = {this.state.voices} />
					</div>
				</div>
				<div style={leftSideWrapper}>
					<div style={embedTitle}>
						SAMOSA FOR WEBSITES
						<div style={iframeEmbed}>

							<div style={embedButton}>
								<button onClick={this.navigate.bind(this, '/embed-popular-now')}> Embed on your site </button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});