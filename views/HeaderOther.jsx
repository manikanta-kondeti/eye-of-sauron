/** @jsx React.DOM */

'use strict';

var React = require('react');
var page = require('page');


module.exports = React.createClass({

	getInitialState: function() {
		return { queryText: null, open_modal: null, login: false};
	},

	logoClick: function() {
		page('/')
	},

	searchQuery: function(e) {
		if(e.keyCode == 13) {
			var queryText = this.refs.search.getDOMNode().value;
	 		page('/search/'+queryText);
	 	}
	},

	render: function() {
	
		var header =  {
			background: 'url(/static/images/header_bg.png) no-repeat center center',
			margin: '0 auto',
			height: '200px',
			width: '100%',
			backgroundSize: 'cover'
		}

		var logo = {
			position: 'absolute',
    		background: 'url(/static/images/logo.png) no-repeat center center',
   	 		backgroundSize: 'cover',
    		width: '100px',
    		height: '100px',
    		top: '60px',
    		left: '50px',
    		cursor: 'pointer'
		}

		var title = {
			position: 'absolute',
 			background: 'url(/static/images/title.png) no-repeat center center',
    		backgroundSize: 'cover',
    		top: '85px',
    		left: '145px',
    		width: '130px',
    		height: '40px'
		}

		var wrapper = {
			position: 'relative',
			width: 'auto',
    		margin: '0 auto',
    		padding: '0',
    		height: '100%'
		}

		var headerBtns = {
			width: '220px',
    		height: '50px',
    		right: '0px',
    		position: 'absolute',
    		top: '30px'
		}

		var searchBoxWrapper  = {
			position: 'absolute',
			width: '360px',
			height: '18px',
			top: '84px',
			marginLeft: '-180px',
			left: '50%'
		}

		var searchBox = {
			width: '100%',
			height: '100%',
			padding: '10px',
			borderRadius: '5px',
			border: '1px solid #eee'
		}

		var languagesBtn =  {
			boxShadow: 'inset 0px 1px 0px 0px #ffffff',
			backgroundColor: '#ffffff',
			borderRadius: '30px',
			border: '1px solid #dcdcdc',
			display: 'inline-block',
			cursor: 'pointer',
			color: '#666666',
			fontFamily: 'Arial',
			fontSize: '10px',
			padding: '8px 16px',
			textDecoration: 'none',
			textShadow: '0px 0px 0px #ffffff'
		}
			
		var loginBtn = {
			boxShadow: '0px 0px 0px 1px #38474F',
			backgroundColor: '#38474F',
			borderRadius: '30px',	
			display: 'inline-block',
			cursor: 'pointer',
			color: '#ffffff',
			fontFamily: 'Arial',
			fontSize: '10px',
			padding: '8px 24px',
			textDecoration: 'none',
			textShadow: '0px 1px 0px #283966'	
		}

 	return (	
 		<div style={header}>
			<div style = {wrapper}>
				<div onClick={this.logoClick} style={logo}></div>
				<div style={title}></div>
			
				<div style={headerBtns}>
					<a href="#" style={languagesBtn}>Select Languages</a> &nbsp;
					<a href="#" style={loginBtn}>Login</a>
				</div>
			
				<div style={searchBoxWrapper}>
					<input onKeyDown={this.searchQuery} ref="search" style={searchBox} placeholder = "Search for audio clips, dialouges, proverbs" />
				</div>

			</div>
		</div>
	)}
})