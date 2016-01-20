'use strict'
var React = require('react');
var Radium = require('radium');
var Header = require('./../views/Header');
var {StyleRoot} = Radium;

var ErrorPage = React.createClass({
	getInitialState : function() {
		return {}
	},

	render : function() {

		var styles = {

			MainDiv : {
				textAlign : 'center',
				marginTop : '225px'
			},

			Title : {
				fontSize : '25px',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {	
					fontSize : '42px'
				}
			},

			Description : {
				fontSize : '18px',
				'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {	
					fontSize : '30px'
				}
			},
		}
		return (
			<StyleRoot>
				<Header />
				<div style = {styles.MainDiv}>
					<h1 style = {styles.Title}> Sorry, this page is not available </h1>
					<p style = {styles.Description}> The link you followed may be broken, or the page may have been removed. 
						<a href="http://getsamosa.com"> Go back to Samosa </a>  
					</p>
				</div>
			</StyleRoot>
		)
	}
});

class ErrorPageWithMediaQuery extends React.Component {
	render() {
		return (
			<StyleRoot>
				<ErrorPage />
			</StyleRoot>
		)
	}
}

module.exports = Radium(ErrorPageWithMediaQuery);