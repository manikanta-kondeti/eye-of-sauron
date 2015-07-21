'use strict'

window.init = function() {
     
    var ROOT = 'https://the-tasty-samosa.appspot.com/_ah/api';
    gapi.client.load('samosa', 'v1', function() {
        popular_now();
    }, ROOT);

};

var popular_now = function() {

    var popular_voices = gapi.client.samosa.api.expressions.popular().execute(
      function(resp) {
      			this.setState({voices: resp.voices})
            });
}


var React = require('react')

module.exports = React.createClass({

	getInitialState: function(){
		return {voices: null}
	},

	render: function() {

		return (

		 <div> 
			{this.state.voices}
		 </div>

		)
	}
});