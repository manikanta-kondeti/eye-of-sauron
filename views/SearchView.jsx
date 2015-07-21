'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {
    }, ROOT);

};

var React = require('react')
var ShowClips = require('./ShowClips')

module.exports = React.createClass({

   componentWillReceiveProps: function() {
   		this.setState({search_result: true})
   },

   search_by_tags: function() {

  		if(this.props.queryText) {
  		  var _this = this
  		  gapi.client.samosa.api.get_search_results({'tags': this.props.queryText}).execute(
            function(resp){             	

            	_this.setState({voices: resp.voices, search_result: false})
            });
  		}

  		else{
  			return 'No Videos Found with this tag :( !'
  		}
	},
    
    getInitialState: function() {
		return {voices: null, search_result:true}
	},

	render: function() {

		if(this.state.search_result) {
			console.log('hi')
			{this.search_by_tags()}
		}
		else {
			console.log('bye')
		}

		var RightSideBarStyle = {
			position: 'absolute',
			marginLeft: '244px',
			top: '60px',
			bottom: '0px',
			display: 'block',
			padding: '25px',
			width: 'auto'
		}

		return (

				<div style = {RightSideBarStyle}>
					<ShowClips clips = {this.state.voices} />
				</div>
		)
	}
});