/** @jsx React.DOM */

'use strict'

var React = require('react')

module.exports = React.createClass({

	render: function() {

		return (

			<a href=''>	
				<img width={this.props.width} height={this.props.height} src = 'https://lh5.ggpht.com/oJpCSXfyxWeLDSM8GKN-SHyv8ZK29pF2NURecNkK1aQD_9mH0ZYscux07oNPgxog28RU=w300'/>
			</a>
		)
	}

});