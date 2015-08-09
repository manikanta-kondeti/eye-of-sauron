'use strict'

var React = require('react')
var ShowClips = require('./ShowClips')

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
		  if ((window.innerHeight + window.scrollY+3) >= document.body.scrollHeight) {
     	  		this.most_recent();
     	  }
	},

	render: function() {

		var RightSideBarStyle = {
			position: 'absolute',
			marginLeft: '200px',
			top: '60px',
			bottom: '0px',
			display: 'block',
			padding: '9px',
			width: 'auto'
		}

		return (

			<div style={RightSideBarStyle}>
			<ShowClips clips = {this.state.voices}/> < /div>

		)
	}
});