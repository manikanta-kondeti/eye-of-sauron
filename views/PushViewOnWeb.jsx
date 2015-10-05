'use strict'

var React = require('react');
var ShowClips = require('./ShowClips');
var RedButton = require('../components/RedButton');
var page = require('page');
var config = require('../config');

module.exports = React.createClass({

	getInitialState: function() {	
		return {voices: [], notification_title: '', auth_key:''}
	},

	componentDidMount: function() {
		this.push_notification_clips(this.props.params.key);
	},

	handleClick: function() {
		page('http://getsamosa.com')	
	},

	push_notification_clips: function(key) {
	var _this = this;
	  /*
	  var voices = gapi.client.samosa.api.expressions.
	  ({'cursor': this.state.cursor, 'auth_key': sessionStorage.getItem('samosa_key')}).execute(
      function(resp) {
      			var new_voices = _this.state.voices.concat(resp.voices);
      			_this.setState({voices: new_voices, cursor: resp.cursor});
            });
	  */

	$.get(config.ajax_url + '/view_push_notification_on_web/'+key, function(response) {
			console.log(response.notification_title);
            _this.setState({voices: response.voices, notification_title: response.notification_title});
            console.log(response.notification_title);
        });
		
	},

	render: function() {

		var container = {
			width: '100%',
			top: '0px',
			left: '0px',
			margin: '2%'
		}

		var TitleStyle = {
			margin: '0 auto',
			width: '500px',
			textAlign: 'center',
			padding: '20px'
		}

		var buttonStyle = {
			width: '200px',
			margin: '0 auto',
			height: '30px',
		}

		return (
		
		<div>

		 	<div style={container}> 
				<h3 align="center" style={TitleStyle} > 
					{this.state.notification_title}	
		 		</h3>
				<ShowClips clips = {this.state.voices} />	
		 		<div onClick={this.handleClick} style = {buttonStyle}> <RedButton text = "SHOW MORE"/>  </div>
			</div>
		</div>

		)
	}
});