'use strict'

var React = require('react')
var ShowClips = require('./ShowClips')
var LoadingSpinner = require('./../components/LoadingSpinner');

module.exports = React.createClass({
	/**
	 * Note: While handling scroll in safari becareful with sroll event. It will be called lot of times unlike chrome and firefox
	 * Hence we used a flag 'search_called' which prevents multiple search_by_tags calls and prevent pagination. 
	 */
	getInitialState: function() {
		return {voices: [], cursor: '',search_result: false, more: true, search_called : false}
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
    			if(!this.state.search_called) {
    				this.search_by_tags();
    			}
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
  		  this.setState({search_called: true});
  		  gapi.client.samosa.api.get_search_results({'tags': queryText, 'cursor': this.state.cursor}).execute(
            function(resp){             
            	var new_voices = _this.state.voices.concat(resp.voices);
            	_this.setState({voices: new_voices, cursor: resp.cursor, search_result: false, more: resp.more, search_called: false})
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
    			if(!this.state.search_called) {
    				this.search_by_tags();
    			}
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

        // Adding a loading toast 
        var loadingSpinner = null;
        if (this.state.search_called){
            loadingSpinner = <LoadingSpinner />
        }

		return (

				<div style = {container}>
					 Search Results For {this.props.params.queryText} <hr/>
					<ShowClips clips = {this.state.voices} />
					{loadingSpinner}
				</div>
		)
	}
});