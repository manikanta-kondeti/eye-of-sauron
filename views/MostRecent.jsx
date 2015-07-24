'use strict'



var React = require('react')
var ShowClips = require('./ShowClips')

module.exports = React.createClass({

	most_recent: function() {
	var _this = this
	  var popular_voices = gapi.client.samosa.api.expressions.recent().execute(
      function(resp) {
      			_this.setState({voices: resp.voices, most_recent: false})
            });
	},

	getInitialState: function(){
		return {voices: null, most_recent: true}
	},

	render: function() {

		if(this.state.most_recent) {
			this.most_recent()
		}

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