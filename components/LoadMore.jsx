'use strict'
var React = require('react');
var Radium = require('radium');
var {StyleRoot} = Radium;

var LoadMoreButton = React.createClass({
	getInitialState : function() {
		return{}
	},

	componentDidMount : function() {
	},

	render : function() {
		var loadmoreStyle = {
			borderRadius : '50%',
			width : '120px',
			height : '120px',
			borderWidth : '2px',
			borderStyle : 'solid',
			boxSizing : 'border-box',
			left : '0px',
			top: '0px',
			color : '#4090db',
			backgroundColor : '#eff3fa',
			borderColor : '#4090db',
			fontSize: '12px',
			':hover': {
      				color : '#4b616e',
      				borderColor : '#4b616e'
    		},
			'@media only screen and (min-device-width: 320px) and (max-device-width: 480px)': {
				borderRadius : '0px',
				height : '70px',
				width : '140px',
				fontSize : '15px'
			}
		
		};

		return(
			<StyleRoot>
				<button style={loadmoreStyle}> LOAD MORE </button>
			</StyleRoot>
		)
	}
});

class LoadMoreButtonWithMediaQueries extends React.Component{
	render() {
		return(
			<StyleRoot>
				<LoadMoreButton />
			</StyleRoot>
		);
	}
}
module.exports = Radium(LoadMoreButtonWithMediaQueries);