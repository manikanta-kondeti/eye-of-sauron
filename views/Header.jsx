/** @jsx React.DOM */


'use strict'


<<<<<<< HEAD
var React = require('react');
var page = require('page');
var Logo = require('../components/Logo');
var InputField = require('../components/InputField');
var RedButton = require('../components/RedButton');
var LinkTo = require('../components/LinkTo');
var LanguageModal = require('../views/LanguageModal');
=======
var React = require('react')
var page = require('page')
var Logo = require('../components/Logo')
var InputField = require('../components/InputField')
var RedButton = require('../components/RedButton')

>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736


module.exports = React.createClass({

	getInitialState: function(){
		return { queryText:null, open_modal: null };
	},

	handleSubmimt: function(e) {
		e.preventDefault()
<<<<<<< HEAD
		var queryText = this.refs.search.getDOMNode().value;
	 	page('/search/'+queryText);
	},

	openModal: function() {	
		this.setState({open_modal: true});
	},

	closeModal: function(){
		this.setState({open_modal: false});
	},

	navigate: function(url) {
		page(url);
=======
		var queryText = this.refs.search.getDOMNode().value
	 	page('/search/'+queryText)
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
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
<<<<<<< HEAD
			fontSize: '24px',
=======
			fontSize: '26px',
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
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
<<<<<<< HEAD
		}

		var rightblockStyle = {
			float: 'right',
			marginTop: '15px',
			width: '280px',
			height: 'auto'
	
		}

		var buttonStyle = {
			float: 'left',
			width: '100px',
			height: '30px',
			marginLeft: '38px'
		}

		var langStyle = {
			fontSize: '10px',
			width: 'auto',
			float: 'left',
			margin: '7px'
		}

		var modalStyle = {
			display: 'none'
		}

		if(this.state.open_modal) {
			modalStyle['display']= 'block';
=======
		}

		var buttonStyle = {
			float:'right',
			marginTop: '15px',
			marginRight: '25px',
			width: '100px',
			height: '30px'
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
		}

		return (

		 <div> 
			<div style = {headerStyle} > 
<<<<<<< HEAD
				<div onClick={this.navigate.bind(this,'/')}>
					<div style = {logoStyle}> <Logo width="35" height="35"/> </div>
					<div style = {titleStyle}> SAMOSA </div>
				</div>
				<div id = "wrapper">
					<div style = {searchBoxStyle}>
						 <form onSubmit={this.handleSubmimt}>
						 	<InputField ref="search" placeholder = "Search For Audio Clips" />
						 </form>
					 </div>
				 	<div style= {rightblockStyle}>
						 <div onClick={this.openModal} style = {langStyle}><LinkTo text="SELECT LANGUAGES" color="black" hover_color="#cc181e" /> </div>
					 	 <div onClick={this.navigate.bind(this,'/login')} style = {buttonStyle}> <RedButton text = "LOGIN"/>  </div>
				 	</div>
				</div>
			</div>

			<div style={modalStyle}> <LanguageModal close_modal={this.closeModal} /> </div>

=======
				<div style = {logoStyle}> <Logo width="35" height="35"/> </div>
				<div style = {titleStyle}> SAMOSA </div>
				<div style = {searchBoxStyle}>
					 <form onSubmit={this.handleSubmimt}>
					 	<InputField ref="search" placeholder = "Search For Audio Clips" />
					 </form>
				 </div>
				<div style = {buttonStyle}> <RedButton name = "LOGIN"/>  </div>
			</div>
>>>>>>> 92d5aea750da3981c4a9fe724732b3383d1c8736
		</div>


		)
	}
})