'use strict'

var React = require('react')
var ShowClips = require('./ShowClips')

module.exports = React.createClass({

   componentWillReceiveProps: function() {
   		this.setState({search_result: true})
   },

   search_by_tags: function() {

   		var queryText = this.props.params.queryText
  		if(queryText) {
  		  var _this = this
  		  gapi.client.samosa.api.get_search_results({'tags': queryText}).execute(
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