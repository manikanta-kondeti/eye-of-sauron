/** @jsx React.DOM */

'use strict'

var React = require('react')

module.exports = React.createClass({

	getInitialState: function(){
		return {hover: false}
	},

	hover: function() {
		this.setState({hover: !this.state.hover})
	
	},

	render: function() {



		var linkStyle = {

			color: this.props.color,
			cursor: 'pointer'
		}

		if(this.state.hover) {
			linkStyle['color'] = this.props.hover_color
		}
	

		return (

			<a onMouseEnter={this.hover} onMouseLeave={this.hover} style={linkStyle}> {this.props.text} </a>
		)
	}

});