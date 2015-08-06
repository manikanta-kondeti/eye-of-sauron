'use strict'

var React = require('react');
var ShowClips = require('./ShowClips');

module.exports = React.createClass({

	getInitialState: function(){
		console.log('hi')
		return {voices: [], cursor: '', auth_key:''}
	},

	componentDidMount: function() {
		this.popular_now();
    	window.addEventListener('scroll', this.handleScroll);
	},

	popular_now: function() {
	var _this = this;
	  var popularr_voices = gapi.client.samosa.api.expressions.popular({'cursor': this.state.cursor, 'auth_key': sessionStorage.getItem('samosa_key')}).execute(
      function(resp) {
      			var new_voices = _this.state.voices.concat(resp.voices);
      			_this.setState({voices: new_voices, cursor: resp.cursor});
            });
	},

	handleScroll: function() {

		  // you're at the bottom of the page
		  if ((window.innerHeight + window.scrollY+3) >= document.body.scrollHeight) {
     		 this.popular_now();
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
			<ShowClips clips = {this.state.voices} />	
		 </div>

		)
	}
});