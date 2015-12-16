'use strict';
var React = require('react');

module.exports = React.createClass({
	render: function() {
        var RightSideBarStyle = {
            position: 'absolute',
            marginLeft: '240px',
            top: '60px',
            bottom: '0px',
            display: 'block',
            padding: '9px',
            width: '83%'      
        } 

        var titleStyle = {
        	fontFamily: 'serif',
        	textAlign: 'center' 
        }

        var bodyDivStyle = {
        	textAlign: 'center',
        	margin: '10px',
        	padding: '5px',
        	fontSize: '15px'
        }

        var spanStyle = {
        	color: 'crimson',
        	fontWeight: 'bold'
        }
		return (
			<div style = {RightSideBarStyle}>
				<div>
					<h1 style = {titleStyle}> Instructions on how to use dashboard </h1>
					<hr/>
				</div>
				<div style = {bodyDivStyle}>
						<p> <span style={spanStyle}>ADMIN</span>: Please follow the guidelines provided by admin which are explained to you. </p>
				</div>
			</div>
		)
	}
});