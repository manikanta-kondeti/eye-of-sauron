'use strict'

var React = require('react')
var ShowClips = require('./ShowClips')


module.exports = React.createClass({

	getInitialState: function() {
		return {voices: [], cursor: '',search_result: false}
	},

	componentDidMount: function() {
		this.search_by_tags();
    	window.addEventListener('scroll', this.handleScroll);
    },

	componentDidUpdate: function() {
		var showCLipsHeight = document.getElementById('show-clips').clientHeight;
    	var windowInnerHeight = window.innerHeight
    	if(showCLipsHeight < windowInnerHeight) {
    			console.log('update');
    		this.search_by_tags();
    	}
	},

	componentWillReceiveProps: function(newProps, oldProps) {
		this.setState({voices: [], cursor: '', search_result: true})
	},


   search_by_tags: function(queryText) {

   		var queryText = this.props.params.queryText;
  		if(queryText) {
  		  var _this = this
  		  gapi.client.samosa.api.get_search_results({'tags': queryText, 'cursor': this.state.cursor}).execute(
            function(resp){             
            	console.log(resp);
            	var new_voices = _this.state.voices.concat(resp.voices);
            	_this.setState({voices: new_voices, cursor: resp.cursor, search_result: false})
            });
  		}

  		else{
  			return 'No Videos Found with this tag :( !'
  		}
	},

	handleScroll: function() {

		  // you're at the bottom of the page
		  if ((window.innerHeight + window.scrollY+3) >= document.body.scrollHeight) {
     		 this.search_by_tags()
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

				<div style = {RightSideBarStyle}>
					<ShowClips clips = {this.state.voices} />
				</div>
		)
	}
});