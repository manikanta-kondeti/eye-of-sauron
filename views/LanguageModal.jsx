/** @jsx React.DOM */

'use strict'

var React = require('react')

module.exports = React.createClass({


	blur: function() {
		this.props.close_modal();
	},

	render: function() {
		
		var overlayStyle = {
    		visibility: 'visible',
     		position: 'absolute',
  		    left: '0px',
    		top: '0px',
     		width: '100%',
     		height: '100%',
     		textAlign: 'center',
 		    zIndex: '1000',
 		    background: 'rgba(0, 0, 0, 0.8)'

 		}

		var modalStyle = {
			width: '300px',
    		margin: '100px auto',
     		backgroundColor: '#fff',
    		border: '1px solid #000',
     		padding: '15px',
     		textAlign: 'center'
		}


		return (
			<div onClick={this.blur} style={overlayStyle}>
     			<div style={modalStyle}>
          			<p>Content you want the user to see goes here. </p>
  			   </div>
			</div>
		)
	}

});