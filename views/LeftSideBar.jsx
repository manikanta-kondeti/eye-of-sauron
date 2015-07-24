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
			{name: 'Trending Now', url: 'popular-now', image_url:'https://www.kewlcircle.com/assets/images/trending.png'},
			{name: 'Most Recent', url: 'most-recent', image_url:'http://www.tablespoon.com/-/media/Images/Landing%20Page%20Icons/icon-recent.png'},
			{name: 'Most Viewed'},
			{name: 'Expressions'}
		]

		return (

				<div style = {LeftSideBarStyle}>
						 <List data = {data} />	
				</div>
		)
	}

});