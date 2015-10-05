/** @jsx React.DOM */

'use strict'

var React = require('react')

var List = require('../List')

module.exports = React.createClass({

	render: function() {

		var LeftSideBarStyle = {
			position: 'fixed',
			background: 'white',
			height: '100%',
    		left: '0', 
    		top: '60px',
    		bottom: '0',
    		display: 'block',
			width: '200px',
			borderRight: '1px solid #e8e8e8',
			zIndex: '999'		
		}

		var data = [
			{name: 'Unapproved', url: 'admin/dashboard/', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			//{name: 'Approved', url: 'admin/dashboard/view-approved', image_url:''},
			{name: 'Push', url:'admin/dashboard/create_push_notification', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'View Clips', url:'admin/dashboard/view_clips', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Actor/Movie', url:'admin/dashboard/add_relationship', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Counter Entity', url:'admin/dashboard/view_counter_entities', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'}

		]

		var downloadIcons = {
			paddingTop: '10px',
			margin: '10px',
			border: '1px solid #e8e8e8',
			padding: '20px'
		}

		return (

				<div style = {LeftSideBarStyle}>
				    <List data = {data} />	
				</div>
		)
	}

});