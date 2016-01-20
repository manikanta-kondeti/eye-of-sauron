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

		var buttonStyle = {
			mozBoxShadow: 'inset -4px -19px 0px -36px #e67a73',
			webkitBoxShadow: 'inset -4px -19px 0px -36px #e67a73',
			boxShadow: 'inset -4px -19px 0px -36px #e67a73',
			backgroundColor: '#eff3fa',
			display: 'inline-block',
			cursor: 'pointer',
			color: '#4b616e',
			fontSize: '13px',
			fontWeight: '400',
			padding: '4px',
			textDecoration: 'none',	
			border: '1px solid rgb(75, 97, 110)',
			width: '100%',
			height: '100%'
		}

		if(this.state.hover) {
			buttonStyle['backgroundImage'] = 'linear-gradient(to bottom, rgba(115,139,150,1) 0%, rgba(96,125,139,1) 100%)';
			buttonStyle['backgroundColor'] = '#4b616e';
		}
	

		return (

			<button id={this.props.id} type={this.props.type} onMouseEnter={this.hover} onMouseLeave={this.hover} style={buttonStyle}> {this.props.text} </button>
		)
	}

});
