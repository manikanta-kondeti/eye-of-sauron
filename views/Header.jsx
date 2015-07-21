/** @jsx React.DOM */


'use strict'


var React = require('react')
var page = require('page')
var Logo = require('../components/Logo')
var InputField = require('../components/InputField')
var RedButton = require('../components/RedButton')



module.exports = React.createClass({

	getInitialState: function(){
		return { queryText:null }
	},

	handleSubmimt: function(e) {
		e.preventDefault()
		var queryText = this.refs.search.getDOMNode().value
	 	page('/search/'+queryText)
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
			fontSize: '26px',
			marginTop: '9px',
			marginLeft: '5px',
			width: '134px'
		};

		var logoStyle = {
			float: 'left',
			marginLeft: '20px',
			marginTop: '9px'
		};

		var searchBoxStyle = {
			float: 'left',
			width: '43%',
			marginTop: '3px'
		}

		var buttonStyle = {
			float:'right',
			marginTop: '15px',
			marginRight: '25px',
			width: '100px',
			height: '30px'
		}

		return (

		 <div> 
			<div style = {headerStyle} > 
				<div style = {logoStyle}> <Logo width="35" height="35"/> </div>
				<div style = {titleStyle}> SAMOSA </div>
				<div style = {searchBoxStyle}>
					 <form onSubmit={this.handleSubmimt}>
					 	<InputField ref="search" placeholder = "Search For Audio Clips" />
					 </form>
				 </div>
				<div style = {buttonStyle}> <RedButton name = "LOGIN"/>  </div>
			</div>
		</div>


		)
	}
})