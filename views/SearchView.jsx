'use strict'

var React = require('react')
var ShowClips = require('./ShowClips')


module.exports = React.createClass({

	getInitialState: function() {
		return {voices: [], cursor: '',search_result: false, more: true}
	},

	componentDidMount: function() {
		this.search_by_tags();
    	window.addEventListener('scroll', this.handleScroll);
    },

	componentDidUpdate: function() {
		var showCLipsHeight = document.getElementById('show-clips').clientHeight;
    	var windowInnerHeight = window.innerHeight
    	if(showCLipsHeight < windowInnerHeight) {
    		if(this.state.more) {
    			this.search_by_tags();
    		}
    	}
	},

	componentWillReceiveProps: function(newProps, oldProps) {
		this.setState({voices: [], cursor: '', search_result: true, more: true})
	},

   	search_by_tags: function() {

   		var queryText = this.props.params.queryText;

  		if(queryText) {
  		  var _this = this;
  		  gapi.client.samosa.api.get_search_results({'tags': queryText, 'cursor': this.state.cursor}).execute(
            function(resp){             
            	var new_voices = _this.state.voices.concat(resp.voices);
            	_this.setState({voices: new_voices, cursor: resp.cursor, search_result: false, more: resp.more})
            });
  		}

  		else{
  			return 'No Videos Found with this tag :( !'
  		}
	},

	
	handleScroll: function() {

		  // you're at the bottom of the page
		  if ((window.innerHeight + window.scrollY+3) >= this.getDocHeight()) {
		  	 //if there are more clips only call the search tags function
		  	 if(this.state.more) { 
     		 	this.search_by_tags();
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

	render: function() {

		var container = {
			width: '100%',
			top: '0px',
			left: '0px',
			margin: '2%'
		}

		return (

				<div style = {container}>
					 Search Results For {this.props.params.queryText} <hr/>
					<ShowClips clips = {this.state.voices} />
				</div>
		)
	}
});