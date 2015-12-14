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
			width: '240px',
			borderRight: '1px solid #e8e8e8',
			zIndex: '999'		
		}

		var data = [
			{name: 'Create New Channel', url:'partners/dashboard/create_new_channel', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Add to Channel', url:'partners/dashboard/add_to_channel', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Upload expression', url:'partners/dashboard/upload_an_expression', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Edit Expression', url:'partners/dashboard/view_clips', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Remove From Channels', url:'partners/dashboard/remove_from_channel', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'}
			
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