/** @jsx React.DOM */

'use strict'
var React = require('react');
var Page = require('page');
var config = require('./../config');
/**
 * This component is used to redirect to actual pages
 * For example: We have viewCounterEntities view which requires a bootstrap stylesheet. 
 * 				Therefore we need to send a 'bootstrap' stylesheet for this view.
 *              Hence we use this component to redirect to actual counter entities page 
 * Flow: This component receives url of the page that needs to be updated (this.props.params['redirect_url'] = )
 * 
 **/

module.exports = React.createClass({
	getInitialState : function() {
		return ({})
	},

	componentDidMount : function() {
		var url = window.location.protocol + "//" + window.location.host + '/admin/dashboard/view_counter_entities';
		window.location = url;
	},

	render : function() {
		return (
			<div></div>
		)
	}
})