'use strict'

var React = require('react')
var ShowClips = require('./ShowClips')
var ShowChannelSuggestons = require('./ShowSuggestedChannels')
var LoadingSpinner = require('./../components/LoadingSpinner');
var Radium = require('radium');
var {StyleRoot} = Radium;

var TypeFiltersForSearch = {
	'AUDIO' : 0,
	'SEARCH' : 11
}
var SearchView = React.createClass({
	/**
	 * Note: While handling scroll in safari becareful with sroll event. It will be called lot of times unlike chrome and firefox
	 * Hence we used a flag 'search_called' which prevents multiple search_by_tags calls and prevent pagination. 
	 */
	getInitialState: function() {
		return {voices: [], cursor: '',search_result: false, more: true, search_called : false, search_message : null, queryText : null, channel_suggestions : []}
	},

	componentDidMount: function() {
		this.search_by_tags();
    	window.addEventListener('scroll', this.handleScroll);
    },

	componentDidUpdate: function() {
		var showCLipsHeight = document.getElementById('show-clips-div').clientHeight + document.getElementById('show-channels').clientHeight;
    	var windowInnerHeight = window.innerHeight;
    	if(showCLipsHeight < windowInnerHeight) {
    		if(this.state.more) {
    			if(!this.state.search_called) {
    				this.search_by_tags();
    			}
    		}
    	}
	},

	componentWillReceiveProps: function(newProps, oldProps) {
		this.setState({voices: [], cursor: '', search_result: true, more: true, channel_suggestions : []})
	},

  	search_by_tags: function() {

 		var queryText = this.props.params.queryText;
 		if (this.state.queryText != queryText) {
 			this.setState({search_message : null});
 		}
		if(queryText) {
		  var _this = this;
		  // Check if user is logged in and send his auth_key
		  var auth_key = '';
		  var search_message = '';
		  var languages= [];
		  var new_channels_suggested = [];
	      if (sessionStorage.samosa_key != '') {
			  		auth_key = sessionStorage.samosa_key;
			  } 
			  this.setState({search_called: true});
	      //IF user not logged in and languages has been set 
	      if (sessionStorage.user_languages_without_login != '' && sessionStorage.user_languages_without_login != undefined) {
	          languages = sessionStorage.user_languages_without_login.split(',');
	          languages.push('global');
	      } 

		  gapi.client.samosa.api.get_search_results({'tags': queryText, 'cursor': this.state.cursor, 'auth_key' : auth_key, 'languages' : languages, 'type_filters' : [TypeFiltersForSearch['AUDIO'], TypeFiltersForSearch['SEARCH']]}).execute(
          function(resp){             
          	var new_voices = _this.state.voices.concat(resp.voices);
          	new_channels_suggested = _this.state.channel_suggestions;
          	if (resp.channels != undefined) {
          		new_channels_suggested = _this.state.channel_suggestions.concat(resp.channels); 
          	}
          	search_message = resp.search_message;
          	if (_this.state.search_message != null) {
          		search_message = _this.state.search_message; 
          	}
          	if (resp.voices == undefined) {
          		_this.setState({search_called : false});
          	}
          	else{
          		_this.setState({voices: new_voices, queryText: queryText, cursor: resp.cursor, search_result: false, more: resp.more, search_called: false, search_message : search_message, channel_suggestions : new_channels_suggested})
          	}
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
			top: '0px',
			left: '0px',
			margin: '2%'
		}

		var ShowChannelSuggestionsStyle = {
			width : 'auto',
			height : '310px',
			overflowX : 'scroll',
			overflowY: 'hidden',
			'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
					marginBottom : '10px',
					height : '390px'
  			}
		}

		var ChannelsDivStyle = {
			display : 'none'
		}

        // Adding a loading toast 
        var loadingSpinner = null;
        if (this.state.search_called){
            loadingSpinner = <LoadingSpinner />
        }

        var search_message = null;
        if (this.state.search_message != '') {
        	search_message = '(' + this.state.search_message + ')';
        }

        if (this.state.channel_suggestions.length != 0) {
        	ChannelsDivStyle['display'] = 'block'
        }
		return (
			<StyleRoot>
				<div style = {container}>
				    <div style={ChannelsDivStyle}>
						Channel Suggestions : {search_message}<hr/>
						<div style={ShowChannelSuggestionsStyle} id="show-channels">
							<ShowChannelSuggestons clips={this.state.channel_suggestions} />
						</div>
					</div>	
					<div id="show-clips-div">
						Search Results For {this.props.params.queryText} {search_message} <hr/>
						<ShowClips clips = {this.state.voices} />
						{loadingSpinner}
					</div>
				</div>
			</StyleRoot>
		)
	}
});


class SearchViewMediaQuery extends React.Component {
	render() {
		return (
			<StyleRoot>
				<SearchView params={this.props.params}/>
			</StyleRoot>
		)
	}
}

module.exports = Radium(SearchViewMediaQuery);