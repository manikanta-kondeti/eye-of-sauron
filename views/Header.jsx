/** @jsx React.DOM */


'use strict'


var React = require('react')
var Logo = require('../components/Logo')
var InputField = require('../components/InputField')
var RedButton = require('../components/RedButton')
var SearchView = require('./SearchView')
var AudioPlayer = require('../components/AudioPlayer');


module.exports = React.createClass({

	getInitialState: function(){
		return { queryText:null }
	},

	handleSubmimt: function(e) {
		e.preventDefault()
		var queryText = this.refs.search.getDOMNode().value
	 	this.setState({queryText: queryText})
	},

	render: function() {

		var headerStyle = {
			display: 'block',
			width: '100%',
			backgroundColor: '#fff',
			height: '59px',
			position: 'fixed',
			top: '0',
			left: '0',
			boxShadow: '0 0 5px rgba(0, 0, 0, .12)',
			zIndex: 100
		};

		var titleStyle = {
			float: 'left',
			fontSize: '28px',
			marginTop: '9px',
			marginLeft: '5px',
			width: '171px'
		};

		var logoStyle = {
			float: 'left',
			marginLeft: '20px'
		};

		var searchBoxStyle = {
			float: 'left',
			width: '700px',
			height: '37px'
		}

		var buttonStyle = {
			float:'right',
			marginTop: '10px',
			marginRight: '25px'
		}

		return (

		 <div> 
			<div style = {headerStyle} > 
				<div style = {logoStyle}> <Logo width="45" height="45"/> </div>
				<div style = {titleStyle}> SAMOSA </div>
				<div style = {searchBoxStyle}>
					 <form onSubmit={this.handleSubmimt}>
					 	<InputField ref="search" placeholder = "Search For Audio Clips" />
					 </form>
				 </div>
				<div style = {buttonStyle}> <RedButton name = "LOGIN"/>  </div>
			</div>
			<SearchView queryText = {this.state.queryText} />
		</div>


		)
	}
})