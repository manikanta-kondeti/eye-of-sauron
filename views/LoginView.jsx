/** @jsx React.DOM */

'use strict'

var React = require('react')

module.exports = React.createClass({

	componentDidMount: function() {

		document.getElementById('left-side-bar').style.display = 'none';
		document.getElementById('wrapper').style.display = 'none';

	},

	render: function() {

		var wrapperStyle={
			position: 'absolute',
			top: '60px',
			bottom: '0px',
			display: 'block',
			width: '100%',
			backgroundImage: 'url(http://localhost:8080/public/images/collage.jpg)',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover'
		
		}

		var loginBoxStyle = {
			position: 'fixed',
  			top: '50%',
  			left: '50%',
			width: '400px',
			height: '230px',
			marginTop: '-120px',
			marginLeft: '-230px',
    		backgroundColor: '#fff',
    		boxShadow: '0 0 5px rgba(0, 0, 0, .12)',
     		padding: '15px',
     		textAlign: 'center'

		}

		return (

				<div style = {wrapperStyle}>
					<div style = {loginBoxStyle}>

					</div>					
				</div>
		)
	}

});