/** @jsx React.DOM */

'use strict'

var React = require('react')

var List = require('./List')

module.exports = React.createClass({

	render: function() {

		var LeftSideBarStyle = {
			position: 'absolute',
    		left: '0', 
    		top: '60px',
    		bottom: '0',
    		display: 'block',
			width: '200px',
			borderRight: '1px solid #e8e8e8'		
		}

		var data = [
			{name: 'trending now'},
			{name: 'most recent'},
			{name: 'most viewed'},
			{name: 'expressions'}
		]

		return (

				<div style = {LeftSideBarStyle}>
						 <List data = {data} />	
				</div>
		)
	}

});