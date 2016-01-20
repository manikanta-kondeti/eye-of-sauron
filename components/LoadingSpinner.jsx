/** @jsx React.DOM */

'use strict'

var React = require('react')

module.exports = React.createClass({

render: function() {
	var loadingStyle = {
            position: 'absolute',
            left: '50%',
            bottom: '50%'
        }

		return (
			<img style={loadingStyle} id="loading"  src="/static/images/loading.gif" />
		)
	}

});