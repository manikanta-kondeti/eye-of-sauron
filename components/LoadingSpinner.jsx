/** @jsx React.DOM */

'use strict'

var React = require('react')

module.exports = React.createClass({

render: function() {
	var loadingStyle = {
            position: 'absolute',
            left: '50%',
            bottom: '20%'
        }

		return (
			<img style={loadingStyle} width="70px" height="70px" id="loading"  src="http://fultrasound.eu/wp-content/themes/elaborate/images/preloader.gif" />
		)
	}

});