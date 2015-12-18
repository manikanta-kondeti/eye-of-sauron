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
			{name: 'Create channel', url: 'admin/dashboard/create_new_channel', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Add to Channel', url:'admin/dashboard/add_to_channel', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Update Expressions', url:'admin/dashboard/view_clips', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Unapproved', url: 'admin/dashboard/', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Push', url:'admin/dashboard/create_push_notification', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Tag Actor/Movie', url:'admin/dashboard/add_relationship', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			//TODO: this needs to be fixed, (bootstrap issue)
			//{name: 'Counter Entity', url:'admin/dashboard/view_counter_entities', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'NoResultsQuery', url:'admin/dashboard/view_user_query_no_results', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'SearchQueryFrequency', url:'admin/dashboard/view_search_query_frequency', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'TrackedUsers', url:'admin/dashboard/view_tracked_users', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Actors/Movies', url:'admin/dashboard/view_actors_movies', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Remove From Channels', url:'admin/dashboard/remove_from_channel', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'},
			{name: 'Actors/Movies', url:'admin/dashboard/view_actors_movies', image_url:'http://img.informer.com/icons/png/32/1675/1675447.png'}
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