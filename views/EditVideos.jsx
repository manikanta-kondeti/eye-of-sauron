/** 
 * @jsx React.DOM 
 **/

'use strict';

var React = require('react');

module.exports = React.createClass({

    getInitialState: function() {
        return ({trim: false, start_time: null, end_time: null, loadVideo: false, video_id: null})
    },

    createPlayer: function(video_id) {

    	console.log($('#player').get(0).tagName);

    	window.player = new YT.Player('player', {
          height: '390',
          width: '640',	
          videoId: video_id
        });
    },

    loadVideoById: function(video_id, start_time, end_time) {

    	if(! end_time) {
     		window.player.loadVideoById({'videoId': video_id, 'suggestedQuality': 'large'});
     	}
     	else{ 
     		window.player.loadVideoById({'videoId': video_id, 
     			'startSeconds': start_time,
                'endSeconds': end_time,
     			'suggestedQuality': 'large'});
     	}
     
     },

    getCurrentTime: function() {
    	var player = document.getElementById('player');
    	return window.player.getCurrentTime();
    },

    onPlayerStateChange: function(event) {
    	console.log('stoped')
    },

    startTrim: function() {
    	this.setState({trim: true, start_time: this.getCurrentTime()});
    },

    endTrim: function() {
    	this.setState({trim: false, end_time: this.getCurrentTime()});
    },

    loadVideo: function(e) {

    	if(e.keyCode == 13) {
			var video_url = this.refs.video_url.getDOMNode().value;
	 		var video_id = video_url.split('=').pop();

	 		($('#player').get(0).tagName == "DIV") ? this.createPlayer(video_id) : this.loadVideoById(video_id, null, null) 
	 		
	 		this.setState({loadVideo: true, video_id: video_id})
	 	}
    },

    showPreview: function() {
    	this.loadVideoById(this.state.video_id, this.state.start_time, this.state.end_time)
    },

    upload: function() {

    	$.post('http://vamshi-dot-the-tasty-samosa.appspot.com/upload-video', {
    		video_id: this.state.video_id
    	}, function(response){
    		console.log(response)
    	})
    },

    render: function() {

		var container = {
			width: '100%',
			top: '0px',
			left: '0px'
		}
		
		var playerWrapper  = {
	    	position: 'relative',
	    	margin: '0px auto',
	    	width: '600px'
		}
		
		var searchBox =  {
			width: '100%',
			height: '100%',
			padding: '10px',
			borderRadius: '5px',
			border: '1px solid #eee'
		}		


	if(this.state.loadVideo) {
		var button = (!this.state.trim) ? <button onClick={this.startTrim} ref="btn"> Start Trim </button> : <button onClick={this.endTrim} ref="btn"> End Trim </button>
	}
	else {
		var button = null 
	}

	var start_time  = (this.state.start_time != null) ? <div> <b>Start Time </b>{this.state.start_time} secs </div> : null

	var end_time = (this.state.end_time != null) ? <div> <b>End Time </b>{this.state.end_time} secs </div> : null
	
	if(this.state.end_time) {
		var preview_buton = <button onClick={this.showPreview}>Show Preview </button>
		var upload_to_samosa = <button onClick={this.upload}>Upload To Samosa </button>
    var range_selector = <input style={{width: '600px'}} type = "range" />
	}

   	return( 
   			<div style={container}>	
   				<div style = {playerWrapper}>
   					
   					<input onKeyDown={this.loadVideo} ref="video_url" style={searchBox} placeholder = "Enter youtube url" />
  					
   					<div id="player"></div>	
   					{{button}}
   					{{preview_buton}}
   					{{start_time}}
   					{{end_time}}
            {{range_selector}}
   					{{upload_to_samosa}}
    			</div>
   			</div>
   		)
   }

});
