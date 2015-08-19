/** @jsx React.DOM */

'use strict'

var React = require('react');
var page = require('page');


module.exports = React.createClass({

	getInitialState: function() {
		return {
			facebookIconHover: false
		}
	},


	fbIconhover: function() {
		this.setState({
			facebookIconHover: !this.state.facebookIconHover
		})
	},

	render: function() {

			var wrapperStyle = {
				position: 'absolute',
				top: '60px',
				bottom: '0px',
				display: 'block',
				width: '100%',
				backgroundImage: 'url(/public/images/collage.jpg)',
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

			var contentStyle = {
				width: '200px',
				border: '1px solid #e8e8e8',
				padding: '10px',
				fontSize: '15px'
			}

			var loginIconsStyle = {

			}

			var facebookIconStyle = {
				opacity: 0.8
			}

			if (this.state.facebookIconHover) {
				facebookIconStyle['opacity'] = 1
			}


		return (

			<div style = {wrapperStyle} >
				<div style = {loginBoxStyle} >
			

					<div style = {loginIconsStyle} >
						<a href="#" onClick={this.handleClick}>
							<img style={facebookIconStyle} onMouseEnter={this.fbIconhover} onMouseLeave={this.fbIconhover} width="200" src ="https://pgprep.com/assets/images/icons/login-fb.png" />
						</a>
					</div> 
			    </div>
			< /div>
	)
}

});