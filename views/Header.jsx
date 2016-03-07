var React = require('react');
var Bootstrap = require('react-bootstrap');
var {Navbar, Nav, NavItem, DropdownButton, MenuItem} = Bootstrap;

module.exports = React.createClass({
	getInitialState : function(){
		return{}
	},

	render : function(){
		var styles = {
			titleStyle : {
				textAlign : 'center',
				color : 'cadetblue',
				textShadow : '0.5px 0px 1px #888888'
			},

			headerStyle : {
				backgroundColor : '#fff',
				borderColor : '#e7e7e7',
			    position:'fixed',
			    top:'0',
			    width: '100%',
			    zIndex:'100',
			    height : '50px',
			    borderBottom : '1px solid rgba(0,0,0,0.1)'
			}
		}
		return (
			<div style={styles.headerStyle}>
				<h3 style={styles.titleStyle}>SAURON</h3>
			</div>
		)
	}
})