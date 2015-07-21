/** @jsx React.DOM */

'use strict'

var React = require('react')

module.exports = React.createClass({

	render: function() {

		var buttonStyle = {

			mozBoxShadow: 'inset -4px -19px 0px -36px #e67a73',
			webkitBoxShadow: 'inset -4px -19px 0px -36px #e67a73',
			boxShadow: 'inset -4px -19px 0px -36px #e67a73',
			backgroundColor: '#cc181e',
			display: 'inline-block',
			cursor: 'pointer',
			color: '#ffffff',
			fontSize: '12px',
			padding: '4px',
			textDecoration: 'none',	
			border: 'solid 1px transparent',
			width: '100%',
			height: '100%'
		}

	

		return (

			<button style={buttonStyle}> {this.props.name} </button>
		)
	}

});